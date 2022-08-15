"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitLogger = exports.Logger = exports.LOGGER_INJECT_TOKEN = void 0;
const log4js_1 = __importDefault(require("log4js"));
const Dependency_1 = require("../di/Dependency");
const SettingManager_1 = require("../setting/SettingManager");
exports.LOGGER_INJECT_TOKEN = 'Sys:ILogger';
let Logger = class Logger {
    constructor() {
        this._loggers = {};
        this._loggers = this.GetLoggers();
    }
    LogDebug(message, ...args) {
        this._loggers['debug']?.debug(message, ...args);
    }
    LogInfo(message, ...args) {
        this._loggers['info']?.info(message, ...args);
    }
    LogWarn(message, ...args) {
        this._loggers['warn']?.warn(message, ...args);
    }
    LogError(message, ...args) {
        this._loggers['error']?.error(message, ...args);
    }
    LogFatal(message, ...args) {
        this._loggers['fatal']?.fatal(message, ...args);
    }
    GetLoggers() {
        const setting = Dependency_1.Container.resolve(SettingManager_1.SETTING_INJECT_TOKEN);
        const logSetting = setting.GetConfig('log');
        let needAddLoggers = ['debug', 'info', 'warn', 'error', 'fatal'];
        if (logSetting) {
            if (logSetting.logLevel) {
                if (Array.isArray(logSetting.logLevel)) {
                    needAddLoggers = logSetting.logLevel;
                }
                else {
                    switch (logSetting.logLevel) {
                        case 'info':
                            needAddLoggers = ['info', 'warn', 'error', 'fatal'];
                            break;
                        case 'warn':
                            needAddLoggers = ['warn', 'error', 'fatal'];
                            break;
                        case 'error':
                            needAddLoggers = ['error', 'fatal'];
                            break;
                        case 'debug':
                        default:
                            break;
                    }
                }
            }
        }
        const result = {};
        needAddLoggers.forEach((element) => {
            result[element] = this.GetLogger(element);
        });
        return result;
    }
    GetLogger(level) {
        return log4js_1.default.getLogger(level);
    }
};
Logger = __decorate([
    (0, Dependency_1.Singleton)(exports.LOGGER_INJECT_TOKEN),
    __metadata("design:paramtypes", [])
], Logger);
exports.Logger = Logger;
function InitLogger(options) {
    if (!options) {
        options = GetLogOptions();
    }
    log4js_1.default.configure(options);
    Dependency_1.Container.registerSingleton(exports.LOGGER_INJECT_TOKEN, Logger); // 直接注入到容器中
}
exports.InitLogger = InitLogger;
function GetLogOptions() {
    const options = {
        appenders: {
            console: { type: 'console' },
        },
        categories: {
            default: { appenders: ['console'], level: 'debug' },
        },
    };
    const needAddLoggers = ['debug', 'info', 'warn', 'error', 'fatal'];
    needAddLoggers.forEach((element) => {
        AddLogger(element, options);
    });
    return options;
}
function AddLogger(level, options) {
    const category = { appenders: ['console', level], level: level };
    const appender = { type: 'dateFile', filename: `logs/${level}.log`, pattern: '.yyyy-MM-dd', compress: true };
    options.categories[level] = category;
    options.appenders[level] = appender;
}
//# sourceMappingURL=Logger.js.map