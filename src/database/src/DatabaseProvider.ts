import { Container, GetInjectToken, ILogger, LOGGER_INJECT_TOKEN } from '@newbility/core';
import { ExecuteResult, IDatabaseClient } from './DatabaseClient';

export const DB_PROVIDER_INJECT_TOKEN = GetInjectToken('Sys:IDatabaseProvider');

export function GetDatabaseProviderToken(key: string) {
  if (key === 'default') return DB_PROVIDER_INJECT_TOKEN;
  return `${DB_PROVIDER_INJECT_TOKEN}_${key}`;
}

export interface IDatabaseProvider {
  /**
   * 执行数据库指令
   * @param sql sql
   * @param args 参数
   */
  ExecuteAsync<TResult = any>(sql: string, ...args: any): Promise<ExecuteResult<TResult>>;

  /**
   * 使用事务
   * @param fn
   */
  UseTransaction<TResult = void>(fn: (client: IDatabaseClient) => Promise<TResult>): Promise<TResult>;
}

export abstract class DatabaseProvider implements IDatabaseProvider {
  protected Logger: ILogger;
  constructor() {
    this.Logger = Container.resolve<ILogger>(LOGGER_INJECT_TOKEN);
  }

  abstract ExecuteAsync<TResult = any>(sql: string, ...args: any): Promise<ExecuteResult<TResult>>;

  abstract UseTransaction<TResult = void>(fn: (client: IDatabaseClient) => Promise<TResult>): Promise<TResult>;
}
