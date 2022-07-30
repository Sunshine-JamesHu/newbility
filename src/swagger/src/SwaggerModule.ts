import Koa from 'koa';
import { AppModule, ModulePath } from '../../core/src/modularity/AppModule';
import { GetInjectToken, Inject, Injectable } from '../../core/src/di/Dependency';
import { ISwaggerBuilder, SWAGGER_BUILDER_INJECT_TOKEN } from './SwaggerBuilder';
import { ISettingManager, SETTING_INJECT_TOKEN } from '../../core/src/setting/SettingManager';

@ModulePath(__dirname)
@Injectable()
export class SwaggerModule extends AppModule {
  private readonly _app: Koa;
  private readonly _setting: ISettingManager;
  private readonly _swaggerBuilder: ISwaggerBuilder;
  constructor(
    @Inject(GetInjectToken('Sys:App')) app: Koa,
    @Inject(SETTING_INJECT_TOKEN) setting: ISettingManager,
    @Inject(SWAGGER_BUILDER_INJECT_TOKEN) swaggerBuilder: ISwaggerBuilder
  ) {
    super();
    this._app = app;
    this._setting = setting;
    this._swaggerBuilder = swaggerBuilder;
  }
  public OnPostApplicationInitialization(): void {
    const enabled = this._setting.GetConfig<boolean | undefined>('swagger:enabled');
    if (enabled === undefined || enabled === true) {
      this._swaggerBuilder.CreateSwaggerApi(this._app);
    }
  }
}
