import { Abstract, Container } from '../di/Dependency';

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
  return function (target: any, propertyKey?: string, descriptor?: PropertyDescriptor) {
    if (!interceptors || !interceptors.length) return;

    const actionKeys: string[] = [];
    if (propertyKey) {
      actionKeys.push(propertyKey);
    } else {
      const propKeys = Object.getOwnPropertyNames(target.prototype);
      for (let index = 0; index < propKeys.length; index++) {
        const propKey = propKeys[index];
        if (propKey === 'constructor') continue; // 跳过构造函数
        actionKeys.push(propKey);
      }
    }

    if (!actionKeys.length) return;

    for (let index = 0; index < actionKeys.length; index++) {
      const actionKey = actionKeys[index];

      const action = target.prototype[actionKey];
      if (!action || typeof action !== 'function') continue;

      const interceptorInsArr: IInterceptor[] = [];
      for (const interceptor of interceptors) {
        if (typeof interceptor === 'function' || typeof interceptor === 'string') {
          interceptorInsArr.push(Container.resolve<IInterceptor>(interceptor as any));
        } else {
          interceptorInsArr.push(interceptor);
        }
      }

      target.prototype[actionKey] = async function () {
        let args = arguments;
        // 执行前置函数
        for (const interceptorIns of interceptorInsArr) {
          args = await interceptorIns.PreHandler.apply(interceptorIns, [args]);
        }

        // 执行主函数
        let result: any;
        let error: any;
        try {
          result = await Promise.resolve(action.apply(this, args)); // 主执行函数
        } catch (ex: any) {
          error = ex;
        }

        // 执行后置函数
        for (const interceptorIns of interceptorInsArr) {
          args = await interceptorIns.NextHandler.apply(interceptorIns, [result, error]);
        }
      };
    }
  };
}
