import { PoolClient } from 'pg';
import { DatabaseClient, ExecuteResult } from '../database/DatabaseClient';

export class PostgresClient extends DatabaseClient {
  private _client: PoolClient;
  public get Client(): PoolClient {
    return this._client;
  }

  constructor(client: PoolClient) {
    super();
    this._client = client;
  }

  protected async ExecuteByArrArgsAsync<TResult = any>(sql: string, args: Array<any>): Promise<ExecuteResult<TResult>> {
    const execRes = await this.Client.query(sql, args);
    return {
      rowCount: execRes.rowCount,
      rows: execRes.rows as TResult[],
    };
  }

  protected GetSqlArgPlaceholder(argKey: string, argIndex: number): string {
    return `$${argIndex + 1}`;
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
