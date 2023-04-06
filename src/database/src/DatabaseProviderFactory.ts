import { Singleton, Container, NewbilityError } from '@newbility/core';
import { GetDatabaseProviderToken, IDatabaseProvider } from './DatabaseProvider';

export const DB_PROVIDER_FAC_INJECT_TOKEN = 'Sys:IDatabaseProviderFactory';

export interface IDatabaseProviderFactory {
  GetProvider(key?: string): IDatabaseProvider;
}

@Singleton(DB_PROVIDER_FAC_INJECT_TOKEN)
export class DatabaseProviderFactory implements IDatabaseProviderFactory {
  GetProvider(key?: string): IDatabaseProvider {
    const queue = Container.resolve<IDatabaseProvider>(GetDatabaseProviderToken(key || 'default'));
    if (!queue) throw new NewbilityError(`Can not fount database provider,key is [${key}]`);
    return queue;
  }
}
