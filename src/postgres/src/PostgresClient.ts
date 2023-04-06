import { PoolClient } from 'pg';
import { DatabaseClient, ExecuteResult } from '@newbility/database';

export class PostgresClient extends DatabaseClient {
  private _client: PoolClient;
  public get Client(): PoolClient {
    return this._client;
  }

  constructor(client: PoolClient) {
    super();
    this._client = client;
  }

  async ExecuteAsync<TResult = any>(sql: string, ...args: any): Promise<ExecuteResult<TResult>> {
    const execRes = await this.Client.query(sql, args);
    return {
      rowCount: execRes.rowCount,
      rows: execRes.rows as TResult[],
    };
  }

  async BeginTransaction(): Promise<void> {
    await this.ExecuteAsync('BEGIN');
  }

  async Rollback(): Promise<void> {
    await this.ExecuteAsync('ROLLBACK');
  }

  async Commit(): Promise<void> {
    await this.ExecuteAsync('COMMIT');
  }

  Dispose(): void {
    if (this._client) {
      try {
        this._client.release();
      } catch (error) {
        this.Logger.LogWarn('Postgres Client 存在重复释放的问题,请不要多次调用[Dispose]');
      }
    }
  }
}
