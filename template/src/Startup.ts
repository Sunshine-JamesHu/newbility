import {
  DependsOn,
  AppModule,
  ModulePath,
  Injectable,
  Container,
  SETTING_INJECT_TOKEN,
  ISettingManager,
  ILogger,
  LOGGER_INJECT_TOKEN,
  GetInjectToken,
} from '@newbility/core';
import { KoaCoreModule } from '@newbility/koa-core';
import { SwaggerModule, ISwaggerBuilder, SWAGGER_BUILDER_INJECT_TOKEN } from '@newbility/swagger';
import fs from 'fs';
import JSON5 from 'json5';
import Koa from 'koa';

@Injectable()
@ModulePath(__dirname)
@DependsOn(KoaCoreModule, SwaggerModule)
export class Startup extends AppModule {
  public OnPreApplicationInitialization(): void {
    const settingManager = Container.resolve<ISettingManager>(SETTING_INJECT_TOKEN);
    const version = this.GetVersion();
    if (version) {
      settingManager.SetConfig({ version });
    }
  }

  public OnApplicationInitialization(): void {}

  public OnPostApplicationInitialization(): void {
    this.InitSwagger();
  }

  private GetVersion(): string {
    try {
      const json = fs.readFileSync('package.json');
      const pkg = JSON5.parse(json.toString());
      return pkg.version;
    } catch (error) {
      const logger = Container.resolve<ILogger>(LOGGER_INJECT_TOKEN);
      logger.LogWarn('未找到package.json');
    }
    return '0.0.0';
  }

  protected InitSwagger() {
    const setting = Container.resolve<ISettingManager>(SETTING_INJECT_TOKEN);
    const enabled = setting.GetConfig<boolean | undefined>('swagger:enabled');
    if (enabled === undefined || enabled === true) {
      const swaggerBuilder = Container.resolve<ISwaggerBuilder>(SWAGGER_BUILDER_INJECT_TOKEN);
      const app = Container.resolve<Koa>(GetInjectToken('Sys:App'));
      swaggerBuilder.CreateSwaggerApi(app, {
        path: 'swagger',
        info: {
          title: 'Newbility-Template',
          description: 'Newbility模板项目',
        },
        // auth: {
        //   url: '/api/auth/login',
        //   responseConverter: (data: any) => {
        //     return data;
        //   },
        // },
      });
    }
  }
}
