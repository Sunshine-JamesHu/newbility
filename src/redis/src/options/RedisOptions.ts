import { CacheOptions } from '@newbility/core';
import { ClusterOptions, RedisOptions as ROptions } from 'ioredis';

export interface RedisNode {
  host?: string | undefined;
  port?: number | undefined;
}

export interface RedisOptions extends CacheOptions {
  nodes: RedisNode | RedisNode[];
  options?: ROptions;
  clusterOptions?: Omit<ClusterOptions, 'redisOptions'>;
}
