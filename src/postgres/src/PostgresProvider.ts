import { DatabaseProvider, ExecuteResult, IDatabaseClient } from '@newbility/database';
import { UsingAsync } from '@newbility/core';

import { Pool, PoolConfig } from 'pg';
import { PostgresOptions } from './PostgresOptions';
import { PostgresClient } from './PostgresClient';

export class PostgresProvider extends DatabaseProvider {
  protected ConnPool: Pool;
  protected Options: PostgresOptions;

  constructor(options: PostgresOptions) {
    super('postgres');
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

  protected GetConnPool(options: PostgresOptions) {
    const pgOpt: PoolConfig = {
      host: options.address,
      port: options.port ?? 5432,
      database: options.database,
      user: options.userName,
      password: options.password,
      // log: (...msgs: any[]) => {
      //   this.Logger.LogDebug('Postgres', ...msgs);
      // },
    };
    if (options.pool) {
      // 做一个容错
      if (options.pool.min && options.pool.min < 0) {
        options.pool.min = 0;
      }

      pgOpt.min = options.pool.min ?? 0; // 最小连接数
      pgOpt.max = options.pool.max ?? 20; // 最大连接数
    }
    return new Pool(pgOpt);
  }

  protected async GetClientAsync(): Promise<PostgresClient> {
    const client = await this.ConnPool.connect();
    return new PostgresClient(client);
  }
}
