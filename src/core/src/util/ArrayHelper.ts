export class ArrayHelper {
  private constructor() {}

  /**
   * 数组分组
   * @param array 原数组
   * @param key 分组Key
   * @param type 分组后数据类型 0 Map , 1 List
   */
  static GroupBy<T>(array: T[], key: string): { [key: string]: T[] } {
    const groups: { [key: string]: T[] } = {};
    array.forEach((o: any) => {
      let group = null;
      if (key.indexOf(':')) {
        let keys = key.split(':');
        let data = o;
        keys.forEach((element) => {
          data = data[element];
        });
        group = data;
      } else {
        group = o[key];
      }

      if (typeof group === 'object' || typeof group === 'function') throw new Error('分组Key不能是object | function 格式!');

      let groupKey = 'undefined';
      if (group === null) groupKey = 'null';
      else if (group === undefined) groupKey = 'undefined';
      else {
        groupKey = group.toString();
      }

      groups[groupKey] = groups[groupKey] || [];
      groups[groupKey].push(o);
    });
    return groups;
  }

  /**
   * 去重
   * @param array 数组
   * @param key Key
   * @returns
   */
  static Distinct(array: any[], key?: string): any[] {
    let temp = [];
    for (let index = 0; index < array.length; index++) {
      const element = array[index];
      if (index == 0) temp.push(element);
      else {
        let hasThis;
        if (key) hasThis = temp.filter((p: any) => p[key] == element[key])[0];
        else hasThis = temp.filter((p: any) => p == element)[0];
        if (!hasThis) {
          temp.push(element);
        }
      }
    }
    return temp;
  }

  /**
   * 数组 Sum 聚合
   * @param array 数组
   * @param key key
   */
  static Sum(array: any[], key?: string): number {
    let sum = 0;
    for (let index = 0; index < array.length; index++) {
      const element = array[index];
      let val = key ? element[key] : element;
      if (typeof val == 'string') sum += Number(val);
      else if (typeof val == 'number') sum += val;
      else throw new Error('请聚合[Number]类型');
    }
    return +sum.toFixed(2);
  }

  /**
   * 数组排序
   * @param array 数组
   * @param key 排序字段 (这个字段目前只能是[number]类型)
   */
  static Sort(array: any[], key: string): any[] {
    function sortCompare(propName: string) {
      return function (object1: any, object2: any) {
        var value1 = object1[propName];
        var value2 = object2[propName];

        if (value2 < value1) {
          return 1;
        } else if (value2 > value1) {
          return -1;
        } else {
          return 0;
        }
      };
    }
    return array.sort(sortCompare(key));
  }
}
