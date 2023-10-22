import {
  Container,
  GetInjectInfo,
  GetInjectToken,
  Inject,
  Injectable,
  IsAbstract,
  IsMultipleRegister,
  NeedReplaceService,
  ServiceLifetime,
  Singleton,
} from './Dependency';
import { IServiceCollection, SC_INJECT_TOKEN } from './ServiceCollection';

export const SVC_LOADER_INJECT_TOKEN = GetInjectToken('Sys:IServiceLoader');

export interface IServiceLoader {
  RegisterServices(): void;
}

@Singleton(SVC_LOADER_INJECT_TOKEN)
@Injectable()
export class ServiceLoader implements IServiceLoader {
  private readonly _services: IServiceCollection;
  public get Services(): IServiceCollection {
    return this._services;
  }

  constructor(@Inject(SC_INJECT_TOKEN) services: IServiceCollection) {
    this._services = services;
  }

  RegisterServices(): void {
    const services = this._services.GetServices();
    services.forEach((service) => {
      const injectInfo = GetInjectInfo(service);
      if (!injectInfo) return; // 没有注册信息的不进行注册

      const isAbstract = IsAbstract(service);
      if (isAbstract) return; // 抽象类不进行注册

      let isRegistered = Container.isRegistered(injectInfo.token);
      const isMultipleRegister = IsMultipleRegister(service);

      const needReplace = NeedReplaceService(service); // 需要替换服务
      if (needReplace) isRegistered = false;

      if (isRegistered && !isMultipleRegister) return;

      const lifetime = injectInfo.lifetime;
      if (lifetime == ServiceLifetime.Singleton) {
        Container.registerSingleton(injectInfo.token, service as any);
      } else if (lifetime == ServiceLifetime.Transient) {
        Container.register(injectInfo.token, {
          useClass: service as any,
        });
      }
    });
  }
}

export function InitServiceLoader() {
  Container.registerSingleton<IServiceLoader>(SVC_LOADER_INJECT_TOKEN, ServiceLoader);
}
