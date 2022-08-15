import { IServiceCollection } from './ServiceCollection';
export declare const SVC_LOADER_INJECT_TOKEN: string;
export interface IServiceLoader {
    RegisterServices(): void;
}
export declare class ServiceLoader implements IServiceLoader {
    private readonly _services;
    get Services(): IServiceCollection;
    constructor(services: IServiceCollection);
    RegisterServices(): void;
}
export declare function InitServiceLoader(): void;
