import Koa from 'koa';
import { IProgram } from '@newbility/core';
export declare class Program implements IProgram {
    private readonly _app;
    private readonly _startup;
    constructor(startup: any);
    Main(): void;
    protected Initialize(): Promise<void>;
    protected Init(): Promise<void>;
    protected OnServerStarted(): any;
    protected OnApplicationShutdown(): Promise<void>;
    protected GetApp(): Koa;
    protected StartServer(): void;
    private InitSysModule;
    private GetLogger;
    private GetSettingManager;
    private GetPortSetting;
    private RegisterAppIns;
}
