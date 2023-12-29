import {
  Cache,
  CacheEntryOptions,
  DISTRIBUTED_CACHE_INJECT_TOKEN,
  IDistributedCache,
  Injectable,
  NewbilityError,
  ReplaceService,
  Singleton,
} from '@newbility/core';
import { ClusterOptions, Redis, RedisOptions, ClusterNode, Cluster } from 'ioredis';
import { RedisOptions as ROptions } from './options/RedisOptions';
import { RedisCacheData } from './RedisCacheData';

@Injectable()
@ReplaceService()
@Singleton(DISTRIBUTED_CACHE_INJECT_TOKEN)
export class RedisCache extends Cache implements IDistributedCache {
  private readonly _redisClient: Redis | Cluster;
  public get RedisClient(): Redis | Cluster {
    return this._redisClient;
  }

  constructor() {
    super();
    this._redisClient = this.CreateRedisClient();
  }

  async GetAsync<TCache = any>(key: string): Promise<TCache | undefined> {
    const data = await this.RedisClient.hgetall(key);
    if (!data.data) return undefined;

    if (data.sldexp) await this.RedisClient.pexpire(key, Number(data.sldexp) * 1000); // 滑动过期增加有效时间
    return JSON.parse(data.data) as TCache;
  }

  async SetAsync<TCache = any>(key: string, data: TCache, options?: CacheEntryOptions | undefined): Promise<void> {
    const cacheData: RedisCacheData = { data: JSON.stringify(data) };
    if (options && options.type === 'sliding') cacheData.sldexp = options.ttl ?? -1; // 滑动过过期将过期时间写入Redis中

    const pipeline = this.RedisClient.multi().hset(key, cacheData);
    // 设置过期时间
    if (options && options.ttl) pipeline.expire(key, Math.ceil(options.ttl));
    await pipeline.exec();
  }

  async RemoveAsync(key: string): Promise<void> {
    await this.RedisClient.del(key);
  }

  protected CreateRedisClient(): Redis | Cluster {
    const options = this.GetOptions();
    let client: Redis | Cluster;
    if (Array.isArray(options.nodes)) {
      if (options.options) {
        const keys = ['port', 'host', 'path', 'sentinels', 'retryStrategy', 'enableOfflineQueue', 'readOnly'];
        keys.forEach((key) => delete (options.options as any)[key]);
      }
      let cOpt: ClusterOptions | undefined = undefined;
      if (options.clusterOptions || options.options) {
        if (options.clusterOptions) cOpt = { ...options.clusterOptions };
        if (options.options) cOpt = { ...(cOpt ?? {}), redisOptions: options.options as any };
      }
      client = new Cluster(options.nodes, cOpt);
    } else {
      const rOpt: RedisOptions = {
        ...options.nodes,
        ...options.options,
      };
      client = new Redis(rOpt);
    }
    return client;
  }

  protected GetOptions(): ROptions {
    const redisConf = this.SettingManager.GetConfig<ROptions>('redis');
    if (!redisConf || !redisConf.nodes || (Array.isArray(redisConf.nodes) && !redisConf.nodes.length))
      throw new NewbilityError('Please choose redis node');

    // 处理单节点与多节点的配置
    if (Array.isArray(redisConf.nodes) && redisConf.nodes.length == 1) redisConf.nodes = redisConf.nodes[0];

    return redisConf;
  }
}
