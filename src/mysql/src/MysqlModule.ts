import { Injectable, ModulePath } from '@newbility/core';
import { DatabaseModuleBase } from '@newbility/database';
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
