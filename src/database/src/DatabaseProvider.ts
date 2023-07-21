import { Container, GetInjectToken, IAsyncDisposable, ILogger, LOGGER_INJECT_TOKEN } from '@newbility/core';
import { ExecuteResult, IDatabaseClient } from './DatabaseClient';

export const DB_PROVIDER_INJECT_TOKEN = GetInjectToken('Sys:IDatabaseProvider');

export function GetDatabaseProviderToken(key: string) {
  if (key === 'default') return DB_PROVIDER_INJECT_TOKEN;
  return `${DB_PROVIDER_INJECT_TOKEN}_${key}`;
}

export interface IDatabaseProvider extends IAsyncDisposable {
  /**
   * 执行数据库指令
   * @param sql sql
   * @param args 参数
   */
  ExecuteAsync<TResult = any>(sql: string, ...args: any): Promise<ExecuteResult<TResult>>;

  /**
   * 分页查询
   * @param sql SQL
   * @param args SQL参数
   */
  QueryPageAsync<TResult = any>(sql: string, args: { [key: string]: any }): Promise<{ totalCount: number; data: TResult[] }>;

  /**
   * 查询第一个
   * @param sql SQL
   * @param args SQL参数
   */
  QueryOneAsync<TResult = any>(sql: string, ...args: Array<any>): Promise<TResult | undefined>;

  /**
   * 使用事务
   * @param fn
   */
  UseTransaction<TResult = void>(fn: (client: IDatabaseClient) => Promise<TResult>): Promise<TResult>;
}

export abstract class DatabaseProvider implements IDatabaseProvider {
  public readonly ProviderType: string;
  protected Logger: ILogger;
  constructor(providerType: string) {
    this.Logger = Container.resolve<ILogger>(LOGGER_INJECT_TOKEN);
    this.ProviderType = providerType;
  }

  abstract QueryPageAsync<TResult = any>(sql: string, args: { [key: string]: any }): Promise<{ totalCount: number; data: TResult[] }>;
  
  abstract QueryOneAsync<TResult = any>(sql: string, ...args: any[]): Promise<TResult | undefined>;

  abstract DisposeAsync(): Promise<void>;

  abstract ExecuteAsync<TResult = any>(sql: string, ...args: any): Promise<ExecuteResult<TResult>>;

  abstract UseTransaction<TResult = void>(fn: (client: IDatabaseClient) => Promise<TResult>): Promise<TResult>;
}
