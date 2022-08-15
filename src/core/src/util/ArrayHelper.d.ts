export declare class ArrayHelper {
    private constructor();
    /**
     * 数组分组
     * @param array 原数组
     * @param key 分组Key
     * @param type 分组后数据类型 0 Map , 1 List
     */
    static GroupBy<T>(array: T[], key: string): {
        [key: string]: T[];
    };
    /**
     * 去重
     * @param array 数组
     * @param key Key
     * @returns
     */
    static Distinct(array: any[], key?: string): any[];
    /**
     * 数组 Sum 聚合
     * @param array 数组
     * @param key key
     */
    static Sum(array: any[], key?: string): number;
    /**
     * 数组排序
     * @param array 数组
     * @param key 排序字段 (这个字段目前只能是[number]类型)
     */
    static Sort(array: any[], key: string): any[];
}
