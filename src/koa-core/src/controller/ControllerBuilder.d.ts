import Koa, { Context, Next } from 'koa';
import { ILogger, ISettingManager } from '@newbility/core';
export declare const CTL_BUILDER_INJECT_TOKEN: string;
export interface ActionDescriptor {
    fullPath: string;
    httpMethod: 'get' | 'post' | 'put' | 'delete' | 'options';
    func: (context: Context, next: Next) => Promise<any>;
}
export interface IControllerBuilder {
    CreateControllers(): void;
}
export declare class ControllerBuilder implements IControllerBuilder {
    private readonly _settingManager;
    private readonly _logger;
    private readonly _apiPrefix;
    private readonly _app;
    constructor(settingManager: ISettingManager, logger: ILogger, app: Koa);
    CreateControllers(): void;
    protected GetControllerActionDescriptors(controller: Function): ActionDescriptor[] | undefined;
}
