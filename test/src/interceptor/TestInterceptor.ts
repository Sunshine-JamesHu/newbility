import { InterceptorBase } from './Interceptor';
import { Singleton } from '@newbility/core';

@Singleton()
export class TestInterceptor extends InterceptorBase {
  public PreHandler(args: any): Promise<any> {
    console.log("1111111")
    return Promise.resolve(args);
  }

  public NextHandler(result: any, error?: Error): Promise<any> {
    console.log("2222222")
    if (error) throw error;
    return Promise.resolve(result);
  }
}
