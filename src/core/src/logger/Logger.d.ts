import log4js from 'log4js';
export declare const LOGGER_INJECT_TOKEN = "Sys:ILogger";
declare type LoggerLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal';
export interface ILogger {
    LogDebug(message: string, ...args: any[]): void;
    LogInfo(message: string, ...args: any[]): void;
    LogWarn(message: string, ...args: any[]): void;
    LogError(message: string, ...args: any[]): void;
    LogFatal(message: string, ...args: any[]): void;
}
export declare class Logger implements ILogger {
    private readonly _loggers;
    constructor();
    LogDebug(message: string, ...args: any[]): void;
    LogInfo(message: string, ...args: any[]): void;
    LogWarn(message: string, ...args: any[]): void;
    LogError(message: string, ...args: any[]): void;
    LogFatal(message: string, ...args: any[]): void;
    protected GetLoggers(): {
        [key: string]: log4js.Logger;
    };
    protected GetLogger(level?: LoggerLevel): log4js.Logger;
}
export interface LoggerOptions {
    logLevel: LoggerLevel[] | LoggerLevel;
}
export declare function InitLogger(options?: log4js.Configuration): void;
export {};
