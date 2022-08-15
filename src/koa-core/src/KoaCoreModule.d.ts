import Koa from 'koa';
import { ISettingManager, AppModule } from '@newbility/core';
import { IControllerBuilder } from './controller/ControllerBuilder';
import { ISwaggerBuilder } from './swagger/SwaggerBuilder';
export declare class KoaCoreModule extends AppModule {
    private readonly _app;
    private readonly _setting;
    private readonly _ctlBuilder;
    private readonly _swaggerBuilder;
    constructor(app: Koa, setting: ISettingManager, ctlBuilder: IControllerBuilder, swaggerBuilder: ISwaggerBuilder);
    OnApplicationInitialization(): void;
    OnPostApplicationInitialization(): void;
    protected InitSysMiddlewares(): void;
    /**
     * 初始化跨域
     */
    protected InitCors(): void;
    /**
     * 初始化压缩
     */
    protected InitCompress(): void;
    /**
     * 初始化静态资源
     */
    protected InitStaticResource(): void;
    /**
     * 初始化Body参数
     */
    protected InitBody(): void;
    protected InitSwagger(): void;
}
