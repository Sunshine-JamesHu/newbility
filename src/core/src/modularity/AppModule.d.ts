import { IServiceCollection } from '../di/ServiceCollection';
export declare const MODULE_INJECT_TOKEN: string;
export interface IAppModule {
    OnPreApplicationInitialization(): Promise<void> | void;
    OnApplicationInitialization(): Promise<void> | void;
    OnPostApplicationInitialization(): Promise<void> | void;
    OnApplicationShutdown(): Promise<void> | void;
}
export declare abstract class AppModule implements IAppModule {
    OnPreApplicationInitialization(): void | Promise<void>;
    OnApplicationInitialization(): void | Promise<void>;
    OnPostApplicationInitialization(): void | Promise<void>;
    OnApplicationShutdown(): void | Promise<void>;
}
export declare const MODULE_PATH_METADATA_TOKEN: string;
export declare function ModulePath(modulePath: string): (target: Function) => void;
export declare function GetModulePath(target: any): string | undefined;
/**
 * 启动模块
 * @param moduleType 模块类型
 */
export declare function StartModule(moduleType: any): Promise<void>;
/**
 * 停止模块
 * @param moduleType 模块类型
 */
export declare function StopModule(moduleType: any): Promise<void>;
export declare function GetModuleDepends(moduleType: any): Set<any>;
export declare function RegisterModuleByPath(modulePath: string, services: IServiceCollection): void;
export declare function RegisterModule(module: Function, services: IServiceCollection): void;
