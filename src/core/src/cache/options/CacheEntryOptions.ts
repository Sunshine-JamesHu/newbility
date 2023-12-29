export interface CacheEntryOptions {
  /**
   * 缓存类型
   */
  type: 'sliding' | 'absolute';

  /**
   * 过期时间(单位秒)
   */
  ttl?: number;
}
