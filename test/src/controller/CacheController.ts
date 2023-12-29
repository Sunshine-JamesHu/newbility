import {
  Injectable,
  Transient,
  Inject,
  MEMORY_CACHE_INJECT_TOKEN,
  IMemoryCache,
  DISTRIBUTED_CACHE_INJECT_TOKEN,
  IDistributedCache,
} from '@newbility/core';
import { HttpGet, HttpPost, Controller, RequestBody, RequestQuery, Router } from '@newbility/koa-core';

@Injectable()
@Transient()
@Router({ desc: '缓存测试' })
export default class CacheController extends Controller {
  constructor(
    @Inject(MEMORY_CACHE_INJECT_TOKEN) private readonly _memCache: IMemoryCache,
    @Inject(DISTRIBUTED_CACHE_INJECT_TOKEN) private readonly _disCache: IDistributedCache
  ) {
    super();
  }

  @HttpGet()
  async Get(@RequestQuery('key') key: string) {
    return await this._memCache.GetAsync(key);
  }

  @HttpPost()
  async SlidingSet(@RequestBody() input: { key: string; val: any; ttl?: number }) {
    await this._memCache.SetAsync(input.key, input.val, { type: 'sliding', ttl: input.ttl });
  }

  @HttpPost()
  async AbsoluteSet(@RequestBody() input: { key: string; val: any; ttl?: number }) {
    await this._memCache.SetAsync(input.key, input.val, { type: 'absolute', ttl: input.ttl });
  }

  @HttpGet()
  async DGet(@RequestQuery('key') key: string) {
    return await this._disCache.GetAsync(key);
  }

  @HttpPost()
  async DSlidingSet(@RequestBody() input: { key: string; val: any; ttl?: number }) {
    await this._disCache.SetAsync(input.key, input.val, { type: 'sliding', ttl: input.ttl });
  }

  @HttpPost()
  async DAbsoluteSet(@RequestBody() input: { key: string; val: any; ttl?: number }) {
    await this._disCache.SetAsync(input.key, input.val, { type: 'absolute', ttl: input.ttl });
  }
}
