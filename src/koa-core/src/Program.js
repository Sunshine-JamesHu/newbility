"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Program = void 0;
const koa_1 = __importDefault(require("koa"));
const core_1 = require("@newbility/core");
const Error_1 = require("./error/Error");
class Program {
    constructor(startup) {
        this._app = new koa_1.default();
        this._startup = startup;
    }
    Main() {
        this.Initialize().then(() => {
            this.StartServer();
        });
    }
    async Initialize() {
        this.InitSysModule(); // 初始化系统模块
        await (0, core_1.StartModule)(this._startup); // 启动程序应用模块
        await this.Init();
    }
    async Init() { }
    OnServerStarted() { }
    async OnApplicationShutdown() {
        await (0, core_1.StopModule)(this._startup);
    }
    GetApp() {
        return this._app;
    }
    StartServer() {
        const app = this.GetApp();
        const port = this.GetPortSetting();
        const logger = this.GetLogger();
        app.listen(port, () => {
            logger.LogInfo(`Server running on port ${port}`);
            this.OnServerStarted();
        });
        process.on('uncaughtException', (err) => {
            logger.LogFatal('An uncapped exception occurred', err);
        });
        process.on('unhandledRejection', (err, promise) => {
            logger.LogFatal('An uncapped exception occurred from promise', err);
        });
        process.on('SIGINT', () => {
            this.OnApplicationShutdown().then(() => {
                process.exit(0);
            });
        });
    }
    //#region 私有拓展
    InitSysModule() {
        this.RegisterAppIns(); // 将APP塞入容器
        (0, core_1.InitSettingManager)(); // 初始化配置
        (0, core_1.InitLogger)(); // 初始化日志
        (0, core_1.InitServiceCollection)(); // 初始化服务
        (0, core_1.InitServiceLoader)();
        (0, Error_1.InitGlobalError)(this.GetApp()); // 全局异常捕获
    }
    GetLogger() {
        return core_1.Container.resolve(core_1.LOGGER_INJECT_TOKEN);
    }
    GetSettingManager() {
        return core_1.Container.resolve(core_1.SETTING_INJECT_TOKEN);
    }
    GetPortSetting() {
        const setting = this.GetSettingManager();
        const port = setting.GetConfig('port');
        if (port && port > 0)
            return port;
        return 30000;
    }
    RegisterAppIns() {
        const app = this.GetApp();
        core_1.Container.register((0, core_1.GetInjectToken)('Sys:App'), { useValue: app });
    }
}
exports.Program = Program;
//# sourceMappingURL=Program.js.map