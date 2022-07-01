export interface IDisposable {
  Dispose(): void;
}

export interface IAsyncDisposable {
  DisposeAsync(): Promise<void>;
}

export async function UsingAsync<TResult = void>(ins: IAsyncDisposable | IDisposable, func: () => Promise<TResult> | TResult): Promise<TResult> {
  let result = undefined;
  try {
    if (func) {
      const fnRes = func();
      if (fnRes instanceof Promise) {
        result = await fnRes;
      }
    }
  } catch (error) {
    throw error;
  } finally {
    // 主函数执行错误也要执行Dispose,防止堆栈溢出
    if (ins) {
      if (ins['DisposeAsync']) {
        await (ins as IAsyncDisposable).DisposeAsync();
      } else {
        (ins as IDisposable).Dispose();
      }
    }
  }
  return result as any;
}
