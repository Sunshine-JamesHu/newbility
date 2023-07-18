export class PromiseHelper {
  private constructor() {}

  public static IsPromise(task: any): boolean {
    return task instanceof Promise;
  }

  public static async GetPromiseResult(taskOrVal: Promise<any> | any): Promise<any> {
    let result: any;
    if (taskOrVal instanceof Promise) {
      result = await taskOrVal;
    } else {
      result = taskOrVal;
    }
  }
}
