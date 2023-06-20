import { Container, IDisposable, ILogger, LOGGER_INJECT_TOKEN, NewbilityError } from '@newbility/core';

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

  async ExecuteAsync<TResult = any>(sql: string, ...args: Array<any>): Promise<ExecuteResult<TResult>> {
    if (args.length === 1 && typeof args[0] === 'object') {
      return await this.ExecuteByObjArgsAsync(sql, args[0]);
    } else {
      return await this.ExecuteByArrArgsAsync(sql, args);
    }
  }

  abstract Dispose(): void;

  protected abstract ExecuteByArrArgsAsync<TResult = any>(sql: string, args: Array<any>): Promise<ExecuteResult<TResult>>;

  protected async ExecuteByObjArgsAsync<TResult = any>(sql: string, args: { [key: string]: any }): Promise<ExecuteResult<TResult>> {
    let relaSql = sql;
    const relaSqlArgs: any[] = [];
    const reg = this.SqlArgsRegExp();

    const matchResult = relaSql.matchAll(reg);
    for (const match of matchResult) {
      const argKey = match['0'].replace(':', '');
      const argVal = args[argKey];
      if (argVal === undefined) throw new NewbilityError(`Missing value for parameter ${argKey}`);

      relaSqlArgs.push(argVal);
      relaSql = relaSql.replace(`:${argKey}`, this.GetSqlArgPlaceholder(argKey, relaSqlArgs.length - 1));
    }

    return await this.ExecuteByArrArgsAsync(relaSql, relaSqlArgs);
  }

  protected abstract GetSqlArgPlaceholder(argKey: string, argIndex: number): string;

  protected SqlArgsRegExp(): RegExp {
    return new RegExp(`(?<!['":]):\\w+(?!['"])`, 'g');
  }
}
