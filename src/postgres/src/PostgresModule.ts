import { Injectable, ModulePath } from '@newbility/core';
import { DatabaseModuleBase } from '@newbility/database';
import { PostgresProvider } from './PostgresProvider';

@ModulePath(__dirname)
@Injectable()
export class PostgresModule extends DatabaseModuleBase {
  constructor() {
    super('postgres');
  }

  protected GetDbProvider(key: string) {
    return PostgresProvider;
  }
}
