import { Injectable, ModulePath, DependsOn } from '@newbility/core';
import { DatabaseModule } from '../../modules/database/DatabaseModule';
import { DatabaseModuleBase } from '../database/DatabaseModuleBase';
import { PostgresProvider } from './PostgresProvider';

@ModulePath(__dirname)
@DependsOn(DatabaseModule)
@Injectable()
export class PostgresModule extends DatabaseModuleBase {
  constructor() {
    super('postgres');
  }

  protected GetDbProvider(key: string) {
    return PostgresProvider;
  }
}
