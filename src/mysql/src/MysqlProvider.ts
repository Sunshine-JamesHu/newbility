import mysql from 'mysql';
import { UsingAsync } from '@newbility/core';
import { DatabaseProvider, ExecuteResult, IDatabaseClient } from '@newbility/database';
import { MysqlOptions } from './MysqlOptions';
import { MysqlClient } from './MysqlClient';

export class MysqlProvider extends DatabaseProvider {
  protected ConnPool: mysql.Pool;
  protected Options: MysqlOptions;

  constructor(options: MysqlOptions) {
    super();
    this.Options = options;
    this.ConnPool = this.GetConnPool(options);
  }

  async UseTransaction<TResult = void>(fn: (client: IDatabaseClient) => Promise<TResult>): Promise<TResult> {
    const client = await this.GetClientAsync();
    return await UsingAsync(client, async () => {
      await client.BeginTransaction();
      let result: any = undefined;
      try {
        result = await fn(client);
        await client.Commit();
      } catch (error) {
        await client.Rollback();
        throw error;
      }
      return result;
    });
  }

  async ExecuteAsync<TResult = any>(sql: string, ...args: any): Promise<ExecuteResult<TResult>> {
    const client = await this.GetClientAsync();
    const result = await UsingAsync(client, async () => {
      const execRes = await client.ExecuteAsync(sql, ...args);
      return execRes;
    });
    return result;
  }

  protected GetConnPool(options: MysqlOptions) {
    const mysqlOpt: mysql.PoolConfig = {
      host: options.address,
      port: options.port ?? 5432,
      database: options.database,
      user: options.userName,
      password: options.password,
    };
    if (options.pool) {
      mysqlOpt.connectionLimit = options.pool.max ?? 20;
    }
    return mysql.createPool(mysqlOpt);
  }

  protected GetClientAsync(): Promise<MysqlClient> {
    return new Promise((resolve, reject) => {
      this.ConnPool.getConnection((err, connection) => {
        if (err) reject(err);
        var client = new MysqlClient(connection);
        resolve(client);
      });
    });
  }
}
