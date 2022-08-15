import Koa from 'koa';
import { ISettingManager } from '@newbility/core';
export declare const SWAGGER_BUILDER_INJECT_TOKEN = "ISwaggerBuilder";
export interface ISwaggerBuilder {
    CreateSwaggerApi(app: Koa): void;
    GenSwaggerJson(): void;
}
export declare class SwaggerBuilder implements ISwaggerBuilder {
    private readonly _settingManager;
    private readonly _apiPrefix;
    constructor(settingManager: ISettingManager);
    CreateSwaggerApi(app: Koa): void;
    GenSwaggerJson(): any;
}
