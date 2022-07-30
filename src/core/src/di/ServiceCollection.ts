import { Container, GetInjectInfo, GetInjectToken, Singleton } from './Dependency';

export const SC_INJECT_TOKEN = GetInjectToken('Sys:IServiceCollection');

export interface IServiceCollection {
  Add(module: Function): void;
  GetServices(): Set<Function>;
}

@Singleton(SC_INJECT_TOKEN)
export class ServiceCollection implements IServiceCollection {
  private readonly _modules: Set<Function>;

  constructor() {
    this._modules = new Set<Function>();
  }

  /**
   * 添加模块
   * @param module
   */
  public Add(module: Function) {
    if (!!GetInjectInfo(module)) {
      this._modules.add(module);
    }
  }

  /**
   * 获取所有模块
   * @returns 所有注册的模块
   */
  public GetServices(): Set<Function> {
    return this._modules;
  }
}

export function InitServiceCollection() {
  Container.registerSingleton<IServiceCollection>(SC_INJECT_TOKEN, ServiceCollection);
}
