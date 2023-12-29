### @newbility/redis

Redis 缓存库，使用 ioredis 实现

### 使用方式

首先应该在Module中引用 `RedisModule`模块

```
// 注入分布式缓存即可使用
@Inject(DISTRIBUTED_CACHE_INJECT_TOKEN) private readonly _disCache: IDistributedCache

```
