import log4js from 'log4js';
import { Singleton, Container } from '../di/Dependency';
import { ISettingManager, SETTING_INJECT_TOKEN } from '../setting/SettingManager';

export const LOGGER_INJECT_TOKEN = 'Sys:ILogger';

declare type LoggerLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal';

export interface ILogger {
  LogDebug(message: string, ...args: any[]): void;
  LogInfo(message: string, ...args: any[]): void;
  LogWarn(message: string, ...args: any[]): void;
  LogError(message: string, ...args: any[]): void;
  LogFatal(message: string, ...args: any[]): void;
}

@Singleton(LOGGER_INJECT_TOKEN)
export class Logger implements ILogger {
  private readonly _loggers: { [key: string]: log4js.Logger } = {};
  constructor() {
    this._loggers = this.GetLoggers();
  }

  public LogDebug(message: string, ...args: any[]): void {
    this._loggers['debug']?.debug(message, ...args);
  }
  public LogInfo(message: string, ...args: any[]): void {
    this._loggers['info']?.info(message, ...args);
  }
  public LogWarn(message: string, ...args: any[]): void {
    this._loggers['warn']?.warn(message, ...args);
  }
  public LogError(message: string, ...args: any[]): void {
    this._loggers['error']?.error(message, ...args);
  }
  public LogFatal(message: string, ...args: any[]): void {
    this._loggers['fatal']?.fatal(message, ...args);
  }

  protected GetLoggers(): { [key: string]: log4js.Logger } {
    const setting = Container.resolve<ISettingManager>(SETTING_INJECT_TOKEN);
    const logSetting = setting.GetConfig<LoggerOptions>('log');
    let needAddLoggers: LoggerLevel[] = ['debug', 'info', 'warn', 'error', 'fatal'];
    if (logSetting) {
      if (logSetting.logLevel) {
        if (Array.isArray(logSetting.logLevel)) {
          needAddLoggers = logSetting.logLevel;
        } else {
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
    const result: { [key: string]: log4js.Logger } = {};

    needAddLoggers.forEach((element) => {
      result[element] = this.GetLogger(element);
    });

    return result;
  }

  protected GetLogger(level?: LoggerLevel) {
    return log4js.getLogger(level);
  }
}

export interface LoggerOptions {
  logLevel: LoggerLevel[] | LoggerLevel;
}

export function InitLogger(options?: log4js.Configuration) {
  if (!options) {
    options = GetLogOptions();
  }
  log4js.configure(options);
  Container.registerSingleton<ILogger>(LOGGER_INJECT_TOKEN, Logger); // 直接注入到容器中
}

function GetLogOptions(): log4js.Configuration {
  const options: log4js.Configuration = {
    appenders: {
      console: { type: 'console' },
    },
    categories: {
      default: { appenders: ['console'], level: 'debug' },
    },
  };

  const needAddLoggers: LoggerLevel[] = ['debug', 'info', 'warn', 'error', 'fatal'];
  needAddLoggers.forEach((element) => {
    AddLogger(element, options);
  });
  return options;
}

function AddLogger(level: LoggerLevel, options: log4js.Configuration) {
  const category = { appenders: ['console', level], level: level };
  const appender = { type: 'dateFile', filename: `logs/${level}.log`, pattern: '.yyyy-MM-dd', compress: true };

  options.categories[level] = category;
  options.appenders[level] = appender;
}
