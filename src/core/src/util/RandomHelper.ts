export class Random {
  private constructor() {}

  /**
   * 随机一个整数
   * @param min 最小值
   * @param max 最大值
   */
  public static Range(min: number, max: number) {
    return Math.floor(Math.random() * (max - min)) + min;
  }
}
