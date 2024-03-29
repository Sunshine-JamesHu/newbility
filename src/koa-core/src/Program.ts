import Koa from 'koa';
import { Server, createServer } from 'http';
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
    //#region 初始化系统模块

    await this.InitSysModule();

    //#endregion

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

    this.RegisterProcessEvent(logger);

    const httpServer = createServer(app.callback());

    this.RegisterCompToHttpServer(httpServer);

    httpServer.listen(port, () => {
      logger.LogInfo(`Server running on port ${port}`);
      this.OnServerStarted();
    });
  }

  protected InitSettingManager(): Promise<void> | void {
    InitSettingManager();
  }

  protected InitLogger(): Promise<void> | void {
    InitLogger(); // 初始化日志
  }

  protected async InitSysModule(): Promise<void> {
    this.RegisterAppIns(); // 将APP塞入容器

    //#region 初始化配置文件
    const initSettingTask = this.InitSettingManager(); // 初始化配置
    if (initSettingTask && initSettingTask instanceof Promise) {
      await initSettingTask;
    }
    //#endregion

    //#region 初始化日志
    const initLoggerTask = this.InitLogger();
    if (initLoggerTask && initLoggerTask instanceof Promise) {
      await initLoggerTask;
    }
    //#endregion

    InitServiceCollection(); // 初始化服务
    InitServiceLoader();
    InitGlobalError(this.GetApp()); // 全局异常捕获
  }

  protected GetLogger() {
    return Container.resolve<ILogger>(LOGGER_INJECT_TOKEN);
  }

  protected GetSettingManager() {
    return Container.resolve<ISettingManager>(SETTING_INJECT_TOKEN);
  }

  protected GetPortSetting(): number {
    const setting = this.GetSettingManager();
    const port = setting.GetConfig<number>('port');
    if (port && port > 0) return port;
    return 30000;
  }

  protected RegisterAppIns() {
    const app = this.GetApp();
    Container.register(GetInjectToken('Sys:App'), { useValue: app });
  }

  protected RegisterProcessEvent(logger?: ILogger) {
    if (!logger) logger = this.GetLogger();
    process.on('uncaughtException', (err: any) => {
      logger?.LogFatal('An uncapped exception occurred', err);
    });

    process.on('unhandledRejection', (err: any, promise: Promise<any>) => {
      logger?.LogFatal('An uncapped exception occurred from promise', err);
    });

    process.on('SIGINT', () => {
      this.OnApplicationShutdown().then(() => {
        process.exit(0);
      });
    });
  }

  protected RegisterCompToHttpServer(httpServer: Server) {
    // 在这里添加 HttpServer的其他组件,比如 Socket
  }
}
