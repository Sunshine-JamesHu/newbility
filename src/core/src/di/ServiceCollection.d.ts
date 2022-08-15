export declare const SC_INJECT_TOKEN: string;
export interface IServiceCollection {
    Add(module: Function): void;
    GetServices(): Set<Function>;
}
export declare class ServiceCollection implements IServiceCollection {
    private readonly _modules;
    constructor();
    /**
     * 添加模块
     * @param module
     */
    Add(module: Function): void;
    /**
     * 获取所有模块
     * @returns 所有注册的模块
     */
    GetServices(): Set<Function>;
}
export declare function InitServiceCollection(): void;
