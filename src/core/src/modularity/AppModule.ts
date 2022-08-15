import path from 'path';
import fs from 'fs';
import {
  Abstract,
  AllowMultiple,
  Container,
  GetInjectInfo,
  GetInjectToken,
  IsAbstract,
  IsMultipleRegister,
  ServiceLifetime,
  Singleton,
} from '../di/Dependency';
import { GetDependModules } from './DependsOn';
import { ILogger, LOGGER_INJECT_TOKEN } from '../logger/Logger';
import { DefineMetadata, GetMetadata, GetMetadataKey } from '../metadata/Metadata';
import { IServiceCollection, SC_INJECT_TOKEN } from '../di/ServiceCollection';
import { IServiceLoader, SVC_LOADER_INJECT_TOKEN } from '../di/ServiceLoader';

export const MODULE_INJECT_TOKEN = GetInjectToken('Sys:IModule');

export interface IAppModule {
  OnPreApplicationInitialization(): Promise<void> | void;
  OnApplicationInitialization(): Promise<void> | void;
  OnPostApplicationInitialization(): Promise<void> | void;
  OnApplicationShutdown(): Promise<void> | void;
}

@Singleton(MODULE_INJECT_TOKEN)
@AllowMultiple()
@Abstract()
export abstract class AppModule implements IAppModule {
  public OnPreApplicationInitialization(): void | Promise<void> {}
  public OnApplicationInitialization(): void | Promise<void> {}
  public OnPostApplicationInitialization(): void | Promise<void> {}
  public OnApplicationShutdown(): void | Promise<void> {}
}

export const MODULE_PATH_METADATA_TOKEN = GetMetadataKey('Sys:ModulePath');

export function ModulePath(modulePath: string) {
  return (target: Function) => {
    DefineMetadata(MODULE_PATH_METADATA_TOKEN, modulePath, target);
  };
}

export function GetModulePath(target: any): string | undefined {
  return GetMetadata(MODULE_PATH_METADATA_TOKEN, target);
}

/**
 * 启动模块
 * @param moduleType 模块类型
 */
export async function StartModule(moduleType: any) {
  const logger = Container.resolve<ILogger>(LOGGER_INJECT_TOKEN);
  const services = Container.resolve<IServiceCollection>(SC_INJECT_TOKEN);
  const serviceLoader = Container.resolve<IServiceLoader>(SVC_LOADER_INJECT_TOKEN);

  const allModule = GetModuleDepends(moduleType);
  allModule.forEach((module) => {
    const modulePath = GetModulePath(module);
    if (modulePath) {
      logger.LogDebug(`Start Module -> ${module.name}`);
      RegisterModuleByPath(modulePath, services);
    }
  });

  // 注册所有Service
  serviceLoader.RegisterServices();

  const allModuleArr = Container.resolveAll<IAppModule>(MODULE_INJECT_TOKEN);

  // 预处理
  for (let index = 0; index < allModuleArr.length; index++) {
    const module = allModuleArr[index];
    const task = module.OnPreApplicationInitialization();
    if (task instanceof Promise) {
      await task;
    }
  }

  // 初始化
  for (let index = 0; index < allModuleArr.length; index++) {
    const module = allModuleArr[index];
    const task = module.OnApplicationInitialization();
    if (task instanceof Promise) {
      await task;
    }
  }

  // 初始化完成之后
  for (let index = 0; index < allModuleArr.length; index++) {
    const module = allModuleArr[index];
    const task = module.OnPostApplicationInitialization();
    if (task instanceof Promise) {
      await task;
    }
  }
}

/**
 * 停止模块
 * @param moduleType 模块类型
 */
export async function StopModule(moduleType: any) {
  const logger = Container.resolve<ILogger>(LOGGER_INJECT_TOKEN);
  const allModule = GetModuleDepends(moduleType);

  const allModuleArr: IAppModule[] = [];
  allModule.forEach((element) => {
    const module = Container.resolve<IAppModule>(element);
    allModuleArr.push(module);
    logger.LogDebug(`Stop Module -> ${element.name}`);
  });

  for (let index = 0; index < allModuleArr.length; index++) {
    const module = allModuleArr[index];
    const task = module.OnApplicationShutdown();
    if (task instanceof Promise) {
      await task;
    }
  }
}

export function GetModuleDepends(moduleType: any) {
  const moduleDepends = new Set<any>();
  const dependModules = GetDependModules(moduleType);
  if (dependModules && dependModules.length > 0) {
    dependModules.forEach((dependModule) => {
      const tmpSet = GetModuleDepends(dependModule);
      if (tmpSet.size > 0) {
        tmpSet.forEach((t: any) => {
          moduleDepends.add(t);
        });
      }
    });
  }
  moduleDepends.add(moduleType);
  return moduleDepends;
}

export function RegisterModuleByPath(modulePath: string, services: IServiceCollection) {
  let files: any[] = [];
  try {
    files = fs.readdirSync(modulePath);
  } catch (error) {
    console.error('Module路径配置错误,请检查配置后重试.');
    files = [];
  }

  files.forEach((filePath) => {
    const fullFilePath = path.join(modulePath, filePath);
    if (fs.statSync(fullFilePath).isDirectory()) {
      RegisterModuleByPath(fullFilePath, services);
    } else {
      const extName = path.extname(fullFilePath);
      if (fullFilePath.endsWith('.d.ts')) return; // 单独去掉.d.ts这个描述文件

      if (extName === '.ts' || extName === '.js') {
        const modules: any[] = require(fullFilePath);
        if (!modules) return;

        for (const key in modules) {
          if (Object.prototype.hasOwnProperty.call(modules, key)) {
            const module = modules[key];
            if (module.prototype) {
              RegisterModule(module, services);
            }
          }
        }
      }
    }
  });
}

export function RegisterModule(module: Function, services: IServiceCollection) {
  const injectInfo = GetInjectInfo(module);
  if (!injectInfo) return; // 没有注册信息的不进行注册

  const isAbstract = IsAbstract(module);
  if (isAbstract) return; // 抽象类不进行注册

  services.Add(module);
}
