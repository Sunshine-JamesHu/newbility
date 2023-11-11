import { Singleton, InterceptorBase } from '@newbility/core';

@Singleton()
export class TestInterceptor extends InterceptorBase {
  public PreHandler(args: any): Promise<any> {
    console.log('A1111111');
    return Promise.resolve(args);
  }

  public NextHandler(result: any, error?: Error): Promise<any> {
    console.log('B1111111');
    if (error) throw error;
    return Promise.resolve(result);
  }
}

@Singleton()
export class TestInterceptor2 extends InterceptorBase {
  public PreHandler(args: any): Promise<any> {
    console.log('A22222');
    return Promise.resolve(args);
  }

  public NextHandler(result: any, error?: Error): Promise<any> {
    console.log('B22222');
    if (error) throw error;
    return Promise.resolve(result);
  }
}
