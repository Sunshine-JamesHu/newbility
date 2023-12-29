import { Abstract, Container } from '../di/Dependency';
import { ILogger, LOGGER_INJECT_TOKEN } from '../logger/Logger';
import { ISettingManager, SETTING_INJECT_TOKEN } from '../setting/SettingManager';
import { CacheEntryOptions } from './options/CacheEntryOptions';

export interface ICache {
  GetAsync<TCache = any>(key: string): Promise<TCache | undefined>;
  SetAsync<TCache = any>(key: string, data: TCache, options?: CacheEntryOptions): Promise<void>;
  RemoveAsync(key: string): Promise<void>;
  GetOrAddAsync<TCache = any>(key: string, func: () => Promise<TCache> | TCache, options?: CacheEntryOptions): Promise<TCache>;
}

@Abstract()
export abstract class Cache implements ICache {
  private readonly _settingManager: ISettingManager;
  protected get SettingManager() {
    return this._settingManager;
  }

  private readonly _logger: ILogger;
  protected get Logger() {
    return this._logger;
  }

  constructor() {
    this._logger = Container.resolve<ILogger>(LOGGER_INJECT_TOKEN);
    this._settingManager = Container.resolve<ISettingManager>(SETTING_INJECT_TOKEN);
  }

  abstract GetAsync<TCache = any>(key: string): Promise<TCache | undefined>;
  abstract SetAsync<TCache = any>(key: string, data: TCache, options?: CacheEntryOptions | undefined): Promise<void>;
  abstract RemoveAsync(key: string): Promise<void>;

  async GetOrAddAsync<TCache = any>(key: string, func: () => Promise<TCache> | TCache, options?: CacheEntryOptions): Promise<TCache> {
    const nullResult: any = null;
    if (!func) return nullResult;

    let cacheData: any = await this.GetAsync<TCache>(key);
    if (cacheData !== null && cacheData !== undefined) return cacheData;

    const cacheDataResult = func();

    if (cacheDataResult instanceof Promise) {
      cacheData = await cacheDataResult;
    } else {
      cacheData = cacheDataResult;
    }

    if (cacheData != null && cacheData != undefined) {
      await this.SetAsync(key, cacheData, options);
    }

    return cacheData;
  }
}
