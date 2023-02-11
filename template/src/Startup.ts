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
} from '@newbility/core';
import { KoaCoreModule } from '@newbility/koa-core';
import fs from 'fs';
import JSON5 from 'json5';

@Injectable()
@ModulePath(__dirname)
@DependsOn(KoaCoreModule)
export class Startup extends AppModule {
  public OnPreApplicationInitialization(): void {
    const settingManager = Container.resolve<ISettingManager>(SETTING_INJECT_TOKEN);
    const version = this.GetVersion();
    if (version) {
      settingManager.SetConfig({ version });
    }
  }
  public OnApplicationInitialization(): void {}

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
}
