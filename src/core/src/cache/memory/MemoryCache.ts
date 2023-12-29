import { GetInjectToken, Injectable, Singleton } from '../../di/Dependency';
import { Cache, ICache } from '../Cache';
import { CacheEntryOptions } from '../options/CacheEntryOptions';
import { LRUCache as LRUCacheDrive } from 'lru-cache';
import { CacheOptions } from '../options/CacheOptions';

export const MEMORY_CACHE_INJECT_TOKEN = GetInjectToken('Sys:IMemoryCache');
export interface IMemoryCache extends ICache {}

@Injectable()
@Singleton(MEMORY_CACHE_INJECT_TOKEN)
export class LRUCache extends Cache implements IMemoryCache {
  private readonly _cacheIns: LRUCacheDrive<string, any>;
  public get CacheIns(): LRUCacheDrive<string, any> {
    return this._cacheIns;
  }

  private readonly _slidingMap: Map<string, number>;
  protected get SlidingMap() {
    return this._slidingMap;
  }

  constructor() {
    super();
    this._cacheIns = this.GenCacheIns();
    this._slidingMap = new Map<string, number>();
  }

  GetAsync<TCache = any>(key: string): Promise<TCache | undefined> {
    let opt: LRUCacheDrive.GetOptions<string, any, unknown> | undefined = undefined;
    if (this.IsSlidingCache(key)) opt = { updateAgeOnGet: true };
    const data = this.CacheIns.get(key, opt) as TCache | undefined;
    return Promise.resolve(data);
  }

  SetAsync<TCache = any>(key: string, data: TCache, options?: CacheEntryOptions | undefined): Promise<void> {
    let opt: LRUCacheDrive.SetOptions<string, any, unknown> | undefined = undefined;
    if (options && options.ttl) opt = { ttl: options.ttl * 1000, noUpdateTTL: false };

    this.CacheIns.set(key, data, opt);

    if (options && options.ttl && options.type === 'sliding') this.AddSlidingCache(key, options.ttl * 1000); // 缓存塞进去后添加滑动过期Key

    return Promise.resolve();
  }

  RemoveAsync(key: string): Promise<void> {
    this.CacheIns.delete(key);
    return Promise.resolve();
  }

  protected GetOptions(): CacheOptions {
    let setting = this.SettingManager.GetConfig<LRUCacheDrive.Options<string, any, unknown>>('cache');
    if (!setting) {
      setting = {
        max: 5000,
        maxSize: 5000 * 1024,
        ttl: 20 * 60 * 1000,
      };
    }
    return setting as CacheOptions;
  }

  protected GenCacheIns(): LRUCacheDrive<string, any> {
    const cacheOpt = this.GetOptions();
    return new LRUCacheDrive<string, any>({
      ...(cacheOpt as any),
      noUpdateTTL: false,
      sizeCalculation: (val: any, key: string) => this.SizeCalculation(val, key),
      dispose: (val: any, key: string) => this.RemoveSlidingCache(key),
    });
  }

  protected SizeCalculation(value: any, key: string): number {
    if (Buffer.isBuffer(value)) {
      return (value as Buffer).byteLength;
    }
    return Buffer.from(JSON.stringify(value), 'utf-8').byteLength;
  }

  protected IsSlidingCache(key: string) {
    return !!this.SlidingMap.get(key);
  }

  protected AddSlidingCache(key: string, ttl: number) {
    this.SlidingMap.set(key, ttl);
  }

  protected RemoveSlidingCache(key: string) {
    this.SlidingMap.delete(key);
  }
}
