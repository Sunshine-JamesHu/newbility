import Koa from 'koa';

import {
  Container,
  GetInjectToken,
  IProgram,
  ILogger,
  LOGGER_INJECT_TOKEN,
  InitLogger,
  InitSettingManager,
  InitServiceCollection,
  InitServiceLoader,
  ISettingManager,
  SETTING_INJECT_TOKEN,
  StartModule,
  StopModule,
} from '@newbility/core';
import { InitGlobalError } from './error/Error';

export class Program implements IProgram {
  private readonly _app: Koa;
  private readonly _startup: any;
  constructor(startup: any) {
    this._app = new Koa();
    this._startup = startup;
  }

  Main(): void {
    this.Initialize().then(() => {
      this.StartServer();
    });
  }

  protected async Initialize() {
    this.InitSysModule(); // 初始化系统模块
    await StartModule(this._startup); // 启动程序应用模块
    await this.Init();
  }

  protected async Init(): Promise<void> {}

  protected OnServerStarted(): any {}

  protected async OnApplicationShutdown(): Promise<void> {
    await StopModule(this._startup);
  }

  protected GetApp(): Koa {
    return this._app;
  }

  protected StartServer() {
    const app = this.GetApp();
    const port = this.GetPortSetting();
    const logger = this.GetLogger();

    app.listen(port, () => {
      logger.LogInfo(`Server running on port ${port}`);
      this.OnServerStarted();
    });

    process.on('uncaughtException', (err: any) => {
      logger.LogFatal('An uncapped exception occurred', err);
    });

    process.on('unhandledRejection', (err: any, promise: Promise<any>) => {
      logger.LogFatal('An uncapped exception occurred from promise', err);
    });

    process.on('SIGINT', () => {
      this.OnApplicationShutdown().then(() => {
        process.exit(0);
      });
    });
  }

  //#region 私有拓展

  private InitSysModule() {
    this.RegisterAppIns(); // 将APP塞入容器

    InitSettingManager(); // 初始化配置
    InitLogger(); // 初始化日志
    InitServiceCollection(); // 初始化服务
    InitServiceLoader();
    InitGlobalError(this.GetApp()); // 全局异常捕获
  }

  private GetLogger() {
    return Container.resolve<ILogger>(LOGGER_INJECT_TOKEN);
  }

  private GetSettingManager() {
    return Container.resolve<ISettingManager>(SETTING_INJECT_TOKEN);
  }

  private GetPortSetting(): number {
    const setting = this.GetSettingManager();
    const port = setting.GetConfig<number>('port');
    if (port && port > 0) return port;
    return 30000;
  }

  private RegisterAppIns() {
    const app = this.GetApp();
    Container.register(GetInjectToken('Sys:App'), { useValue: app });
  }

  //#endregion
}
