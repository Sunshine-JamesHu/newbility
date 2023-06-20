import { Abstract, Container, DefineMetadata } from '@newbility/core';
import { GetActionParamsMetadata } from '@newbility/koa-core';
import { METADATA_ACTION_PARAMS } from '../../modules/koa-core/router/RequestData';

export interface IInterceptor {
  PreHandler(args: any): Promise<any>;
  NextHandler(result: any, error?: Error): Promise<any>;
}

@Abstract()
export abstract class InterceptorBase implements IInterceptor {
  public PreHandler(args: any): Promise<any> {
    return Promise.resolve(args);
  }

  public NextHandler(result: any, error?: Error): Promise<any> {
    if (error) throw error;
    return Promise.resolve(result);
  }
}

export function Interceptor(...interceptors: Array<IInterceptor | Function | string>) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    if (!interceptors || !interceptors.length) return;

    const interceptorInsArr: IInterceptor[] = [];
    for (const interceptor of interceptors) {
      if (typeof interceptor === 'function' || typeof interceptor === 'string') {
        interceptorInsArr.push(Container.resolve<IInterceptor>(interceptor as any));
      } else {
        interceptorInsArr.push(interceptor);
      }
    }

    const action = descriptor.value;

    descriptor.value = async function () {
      let args = arguments;
      // 执行前置函数
      for (const interceptorIns of interceptorInsArr) {
        args = await interceptorIns.PreHandler.apply(interceptorIns, [args]);
      }

      // 执行主函数
      let result: any;
      let error: any;
      try {
        const task = action.apply(this, args); // 主执行函数
        if (task instanceof Promise) {
          result = await task;
        } else {
          result = task;
        }
      } catch (ex: any) {
        error = ex;
      }

      // 执行后置函数
      for (const interceptorIns of interceptorInsArr) {
        result = await interceptorIns.NextHandler.apply(interceptorIns, [result, error]);
      }
      return result;
    };

    // 拦截器打在Controller-Actions上,需要继承原始的元数据
    const actionParams = GetActionParamsMetadata(action);
    if (actionParams) DefineMetadata(METADATA_ACTION_PARAMS, actionParams, descriptor.value);
  };
}
