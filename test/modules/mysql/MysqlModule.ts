import { Injectable, ModulePath } from '@newbility/core';
import { DatabaseModuleBase } from '../database/DatabaseModuleBase';
import { MysqlProvider } from './MysqlProvider';

@ModulePath(__dirname)
@Injectable()
export class MysqlModule extends DatabaseModuleBase {
  constructor() {
    super('mysql');
  }

  protected GetDbProvider(key: string) {
    return MysqlProvider;
  }
}
