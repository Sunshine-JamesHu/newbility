import { Inject, Injectable, Transient } from '@newbility/core';
import { HttpGet, HttpPost, Controller, RequestBody, RequestQuery, Router } from '@newbility/koa-core';
import { IDatabaseProvider, DB_PROVIDER_INJECT_TOKEN, IDatabaseProviderFactory, DB_PROVIDER_FAC_INJECT_TOKEN } from '@newbility/database';

const DBKEY = 'default';

@Injectable()
@Transient()
@Router({ desc: 'Pg数据库测试' })
export default class PgDbController extends Controller {
  constructor(
    @Inject(DB_PROVIDER_INJECT_TOKEN) private readonly _dbProvider: IDatabaseProvider,
    @Inject(DB_PROVIDER_FAC_INJECT_TOKEN) private readonly _dbProviderFactory: IDatabaseProviderFactory
  ) {
    super();
  }

  @HttpGet()
  async GetUserName(@RequestQuery('id') id: number): Promise<string> {
    const dbProvider = this._dbProviderFactory.GetProvider(DBKEY);
    const result = await dbProvider.ExecuteAsync<{ name: string }>(`SELECT name FROM test1 WHERE id = $1`, id);
    return result.rows[0]?.name;
  }

  @HttpGet()
  async GetList(): Promise<{ id: number; name: string }[]> {
    const dbProvider = this._dbProviderFactory.GetProvider(DBKEY);
    const a = await dbProvider.ExecuteAsync('SELECT id, name FROM test1');
    return a.rows;
  }

  @HttpPost()
  async Create(@RequestBody() data: { id: number; name: string }): Promise<void> {
    const dbProvider = this._dbProviderFactory.GetProvider(DBKEY);
    await dbProvider.UseTransaction(async (client) => {
      await client.ExecuteAsync(`INSERT INTO test1 (id, name) VALUES($1, $2)`, data.id, data.name);
    });
  }

  @HttpPost()
  async BatchCreate(@RequestBody() data: { id: number; name: string }[]): Promise<void> {
    const dbProvider = this._dbProviderFactory.GetProvider(DBKEY);
    await dbProvider.UseTransaction(async (client) => {
      for (let index = 0; index < data.length; index++) {
        const element = data[index];
        await client.ExecuteAsync(`INSERT INTO test1 (id, name) VALUES($1, $2)`, element.id, element.name);
      }
    });
  }
}
