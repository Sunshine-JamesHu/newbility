export interface RedisCacheData {
  /**
   * 存储数据
   */
  data: string;

  /**
   * 绝对过期时间
   */
  absexp?: number;

  /**
   * 滑动过期时间
   */
  sldexp?: number;
}
