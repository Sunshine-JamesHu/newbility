import { Container, IDisposable, ILogger, LOGGER_INJECT_TOKEN } from '@newbility/core';

export interface ExecuteResult<T> {
  rowCount: number;
  rows: T[];
}

export interface IDatabaseClient extends IDisposable {
  /**
   * 开始事务
   */
  BeginTransaction(): Promise<void>;

  /**
   * 回滚
   */
  Rollback(): Promise<void>;

  /**
   * 提交
   */
  Commit(): Promise<void>;

  /**
   * 执行数据库命令
   * @param sql SQL
   * @param args SQL参数
   */
  ExecuteAsync<TResult = any>(sql: string, ...args: Array<any>): Promise<ExecuteResult<TResult>>;
}

export abstract class DatabaseClient implements IDatabaseClient {
  protected Logger: ILogger;
  constructor() {
    this.Logger = Container.resolve<ILogger>(LOGGER_INJECT_TOKEN);
  }

  abstract BeginTransaction(): Promise<void>;

  abstract Rollback(): Promise<void>;

  abstract Commit(): Promise<void>;

  abstract ExecuteAsync<TResult = any>(sql: string, ...args: Array<any>): Promise<ExecuteResult<TResult>>;

  abstract Dispose(): void;
}
