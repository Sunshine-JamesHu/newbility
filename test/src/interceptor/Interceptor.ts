import { Abstract, Container, DefineMetadata, GetMetadata, GetMetadataKey } from '@newbility/core';

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

export const INTERCEPTOR_METADATA_KEY: string = GetMetadataKey('Interceptor');

function GetInterceptorMetadata(action: any) {
  const metadata = GetMetadata(INTERCEPTOR_METADATA_KEY, action);
  return metadata;
}

function DefineInterceptorMetadata(metadata: { [key: string]: IInterceptor }, action: any) {
  DefineMetadata(INTERCEPTOR_METADATA_KEY, metadata, action);
}

function RestoreMetadata(metadatas: { key: string; data: any }[], target: any) {
  metadatas.forEach((metadata) => {
    DefineMetadata(metadata.key, metadata.data, target);
  });
}

export function Interceptor(...interceptors: Array<IInterceptor | Function | string>) {
  return function (target: any, propertyKey?: string, descriptor?: PropertyDescriptor) {
    if (!interceptors || !interceptors.length) return;

    let interceptorInsArr: { [key: string]: IInterceptor } = {};
    for (const interceptor of interceptors) {
      let interceptorIns: IInterceptor;
      if (typeof interceptor === 'function' || typeof interceptor === 'string') {
        interceptorIns = Container.resolve<IInterceptor>(interceptor as any);
      } else {
        interceptorIns = interceptor;
      }
      const interceptorKey = (interceptorIns as any).constructor.name;
      interceptorInsArr[interceptorKey] = interceptorIns;
    }

    const isAction = !!(descriptor && descriptor.value);
    const needOverwriteAction: any[] = [];
    if (isAction) {
      let actionMetadata = GetInterceptorMetadata(descriptor.value);
      if (!actionMetadata) {
        needOverwriteAction.push(descriptor.value);
        actionMetadata = {};
      }
      DefineInterceptorMetadata({ ...interceptorInsArr, ...actionMetadata }, descriptor.value);
    } else {
      const actionKeys = Object.getOwnPropertyNames(target.prototype);
      for (let index = 0; index < actionKeys.length; index++) {
        const actionKey = actionKeys[index];
        if (actionKey === 'constructor') continue; // 跳过构造函数
        const action = target.prototype[actionKey];

        let actionMetadata = GetInterceptorMetadata(action);
        if (!actionMetadata) {
          needOverwriteAction.push(actionKey);
          actionMetadata = {};
        }
        DefineInterceptorMetadata({ ...actionMetadata, ...interceptorInsArr }, action);
      }
    }

    if (needOverwriteAction.length) {
      const main = async (action: any, self: any, args: any) => {
        // 这里找拦截器需要使用 self[action.name] 而不是 action(如果使用action,当class上有拦截器的时候,action上的拦截器会不起作用)
        const actionInterceptors: { [key: string]: IInterceptor } = GetInterceptorMetadata(self[action.name]);

        // 执行前置函数
        for (const key in actionInterceptors) {
          if (Object.prototype.hasOwnProperty.call(actionInterceptors, key)) {
            const interceptorIns = actionInterceptors[key];
            args = await interceptorIns.PreHandler.apply(interceptorIns, [args]);
          }
        }

        // 执行主函数
        let result: any;
        let error: any;
        try {
          result = await Promise.resolve(action.apply(self, args)); // 主执行函数
        } catch (ex: any) {
          error = ex;
        }

        // 执行后置函数
        for (const key in actionInterceptors) {
          if (Object.prototype.hasOwnProperty.call(actionInterceptors, key)) {
            const interceptorIns = actionInterceptors[key];
            args = await interceptorIns.NextHandler.apply(interceptorIns, [result, error]);
          }
        }
        return result;
      };

      needOverwriteAction.forEach((element) => {
        const action = isAction ? descriptor.value : target.prototype[element];
        if (isAction) {
          const metadatas = Reflect.getMetadataKeys(descriptor.value).map((key) => {
            return {
              key,
              data: GetMetadata(key, descriptor.value),
            };
          });
          descriptor.value = async function () {
            let args = arguments;
            return await main(element, this, args);
          };
          RestoreMetadata(metadatas, descriptor.value);
        } else {
          const metadatas = Reflect.getMetadataKeys(action).map((key) => {
            return {
              key,
              data: GetMetadata(key, action),
            };
          });
          target.prototype[element] = async function () {
            let args = arguments;
            return await main(action, this, args);
          };
          RestoreMetadata(metadatas, target.prototype[element]);
        }
      });
    }
  };
}
