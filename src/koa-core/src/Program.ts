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

    //#region 启动应用程序

    const preTask = this.PostStartModule();
    if (preTask && preTask instanceof Promise) {
      await preTask;
    }

    await this.StartModule(this._startup);

    const postTask = this.PostStartModule();
    if (postTask && postTask instanceof Promise) {
      await postTask;
    }

    //#endregion
  }

  /**
   * 模块启动前
   */
  protected PreStartModule(): Promise<void> | void {}

  /**
   * 启动模块
   * @param startup Startup
   * @returns
   */
  protected StartModule(startup: any): Promise<void> | void {
    const task = StartModule(startup); // 启动程序应用模块
    return task;
  }

  /**
   * 模块启动后
   */
  protected PostStartModule(): Promise<void> | void {}

  /**
   * 服务启动后
   */
  protected OnServerStarted(): any {}

  protected async OnApplicationShutdown(): Promise<void> {
    await StopModule(this._startup);
  }

  protected GetApp(): Koa {
    return this._app;
  }

  /**
   * 启动服务
   */
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

  protected InitSettingManager() {
    InitSettingManager();
  }

  protected InitLogger() {
    InitLogger(); // 初始化日志
  }

  //#region 私有拓展

  private InitSysModule() {
    this.RegisterAppIns(); // 将APP塞入容器

    this.InitSettingManager(); // 初始化配置
    this.InitLogger();

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
