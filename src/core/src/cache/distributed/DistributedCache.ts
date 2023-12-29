import { Container, GetInjectToken, Injectable, Singleton } from '../../di/Dependency';
import { Cache, ICache } from '../Cache';
import { IMemoryCache, MEMORY_CACHE_INJECT_TOKEN } from '../memory/MemoryCache';
import { CacheEntryOptions } from '../options/CacheEntryOptions';

export const DISTRIBUTED_CACHE_INJECT_TOKEN = GetInjectToken('Sys:IDistributedCache');
export interface IDistributedCache extends ICache {}

@Injectable()
@Singleton(DISTRIBUTED_CACHE_INJECT_TOKEN)
export class DefaultDistributedCache extends Cache implements IDistributedCache {
  private readonly _memoryCache: IMemoryCache;
  protected get MemoryCache() {
    return this._memoryCache;
  }

  constructor() {
    super();
    this._memoryCache = Container.resolve<IMemoryCache>(MEMORY_CACHE_INJECT_TOKEN);
  }
  GetAsync<TCache = any>(key: string): Promise<TCache | undefined> {
    return this._memoryCache.GetAsync<TCache>(key);
  }
  SetAsync<TCache = any>(key: string, data: TCache, options?: CacheEntryOptions | undefined): Promise<void> {
    return this._memoryCache.SetAsync<TCache>(key, data, options);
  }
  RemoveAsync(key: string): Promise<void> {
    return this._memoryCache.RemoveAsync(key);
  }
  GetOrAddAsync<TCache = any>(key: string, func: () => TCache | Promise<TCache>, options?: CacheEntryOptions | undefined): Promise<TCache> {
    return this._memoryCache.GetOrAddAsync<TCache>(key, func, options);
  }
}
