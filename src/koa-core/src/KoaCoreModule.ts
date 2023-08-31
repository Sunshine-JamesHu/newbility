import Koa from 'koa';
import koaBody from 'koa-body';
import koaCompress from 'koa-compress';
import koaStatic from 'koa-static';
import { AddCors, CorsOptions } from './cors/Cors';

import {
  ISettingManager,
  SETTING_INJECT_TOKEN,
  GetInjectToken,
  Inject,
  Injectable,
  AppModule,
  ModulePath,
  DependsOn,
  CoreModule,
} from '@newbility/core';

import { IControllerBuilder, CTL_BUILDER_INJECT_TOKEN } from './controller/ControllerBuilder';
import { run } from './context/HttpContextStorage';

@Injectable()
@DependsOn(CoreModule)
@ModulePath(__dirname)
export class KoaCoreModule extends AppModule {
  private readonly _app: Koa;
  private readonly _setting: ISettingManager;
  private readonly _ctlBuilder: IControllerBuilder;
  constructor(
    @Inject(GetInjectToken('Sys:App')) app: Koa,
    @Inject(SETTING_INJECT_TOKEN) setting: ISettingManager,
    @Inject(CTL_BUILDER_INJECT_TOKEN) ctlBuilder: IControllerBuilder
  ) {
    super();
    this._app = app;
    this._setting = setting;
    this._ctlBuilder = ctlBuilder;
  }

  public OnApplicationInitialization(): void {
    this.InitSysMiddlewares(); // 初始化系统中间件

    this._ctlBuilder.CreateControllers(); // 创建Controller
  }

  //#region  初始化Koa中间件

  protected InitSysMiddlewares() {
    this.InitCors();
    this.InitCompress();
    this.InitStaticResource();
    this.InitBody();
    this.InitHttpContextStorage();
  }

  /**
   * 初始化跨域
   */
  protected InitCors() {
    const enableCors = this._setting.GetConfig<boolean>('cors:enable');
    if (enableCors) {
      const options = this._setting.GetConfig<CorsOptions>('cors:options');
      AddCors(this._app, options);
    }
  }

  /**
   * 初始化压缩
   */
  protected InitCompress() {
    const app = this._app;
    app.use(
      koaCompress({
        filter: (content_type) => {
          // 压缩Filter
          return /html|text|javascript|css|json/i.test(content_type);
        },
        threshold: 128 * 1024, // 超过128k就压缩
        br: false, // br性能有问题
      })
    );
  }

  /**
   * 初始化静态资源
   */
  protected InitStaticResource() {
    const app = this._app;
    app.use(koaStatic(`${__dirname}/../public`, { maxage: 1000 * 60 * 60 }));
  }

  /**
   * 初始化Body参数
   */
  protected InitBody() {
    const app = this._app;
    let maxFileSize = this._setting.GetConfig<number | undefined>('maxFileSize');
    if (!maxFileSize) maxFileSize = 200 * 1024 * 1024;

    app.use(
      koaBody({
        parsedMethods: ['POST', 'PUT', 'PATCH', 'DELETE', 'GET', 'HEAD'],
        multipart: true,
        formidable: {
          maxFileSize: maxFileSize,
        },
      })
    );
  }

  protected InitHttpContextStorage() {
    const app = this._app;
    app.use(run);
  }

  //#endregion
}
