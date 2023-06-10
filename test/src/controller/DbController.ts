import { Inject, Injectable, Transient } from '@newbility/core';
import { HttpGet, HttpPost, Controller, RequestBody, RequestQuery, Router } from '@newbility/koa-core';
import { IDatabaseProvider, DB_PROVIDER_INJECT_TOKEN, IDatabaseProviderFactory, DB_PROVIDER_FAC_INJECT_TOKEN } from '@newbility/database';

const DB_KEY = ['default', 'mysql'];
const DB_TABLE = 'newbility_user';

@Injectable()
@Transient()
@Router({ desc: '数据库测试' })
export default class DbController extends Controller {
  private readonly _dbProviders: { [key: string]: IDatabaseProvider };
  private readonly _dbProviderFactory: IDatabaseProviderFactory;
  constructor(@Inject(DB_PROVIDER_FAC_INJECT_TOKEN) dbProviderFactory: IDatabaseProviderFactory) {
    super();
    this._dbProviderFactory = dbProviderFactory;
    this._dbProviders = this.GetDbProviders(dbProviderFactory);
  }

  private GetDbProviders(dbProviderFactory: IDatabaseProviderFactory) {
    const providers: { [key: string]: IDatabaseProvider } = {};
    DB_KEY.forEach((key) => {
      const dbProvider = dbProviderFactory.GetProvider(key);
      providers[key] = dbProvider;
    });
    return providers;
  }

  @HttpGet()
  async GetById(@RequestQuery('id') id: number) {
    const sql = `SELECT * FROM ${DB_TABLE} WHERE id = :id`;

    const result: any = {};
    for (const key in this._dbProviders) {
      if (Object.prototype.hasOwnProperty.call(this._dbProviders, key)) {
        const dbProvider = this._dbProviders[key];
        const res = await dbProvider.ExecuteAsync<any>(sql, { id });
        result[key] = res;
      }
    }
    return result;
  }

  @HttpGet()
  async GetList() {
    const sql = `SELECT * FROM ${DB_TABLE}`;
    const result: any = {};
    for (const key in this._dbProviders) {
      if (Object.prototype.hasOwnProperty.call(this._dbProviders, key)) {
        const dbProvider = this._dbProviders[key];
        const res = await dbProvider.ExecuteAsync<any>(sql);
        result[key] = res;
      }
    }
    return result;
  }

  @HttpPost()
  async Create(@RequestBody() data: { id: number; name: string; age: number; password: string }): Promise<void> {
    const sql = `INSERT INTO ${DB_TABLE} (id, name,age,password) VALUES(:id, :name,:age,:password)`;
    const sqlArg = { id: data.id, name: data.name, age: data.age, password: data.password };
    for (const key in this._dbProviders) {
      if (Object.prototype.hasOwnProperty.call(this._dbProviders, key)) {
        const dbProvider = this._dbProviders[key];
        await dbProvider.UseTransaction(async (client) => {
          await client.ExecuteAsync(sql, sqlArg);
        });
      }
    }
  }

  @HttpPost()
  async BatchCreate(@RequestBody() data: { id: number; name: string; age: number; password: string }[]): Promise<void> {
    const sql = `INSERT INTO ${DB_TABLE} (id, name,age,password) VALUES(:id, :name,:age,:password)`;
    for (const key in this._dbProviders) {
      if (Object.prototype.hasOwnProperty.call(this._dbProviders, key)) {
        const dbProvider = this._dbProviders[key];
        await dbProvider.UseTransaction(async (client) => {
          for (let index = 0; index < data.length; index++) {
            const element = data[index];
            const sqlArg = { id: element.id, name: element.name, age: element.age, password: element.password };
            await client.ExecuteAsync(sql, sqlArg);
          }
        });
      }
    }
  }
}
