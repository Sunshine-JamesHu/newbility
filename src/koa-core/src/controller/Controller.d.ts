import { Context } from 'koa';
import { ILogger } from '@newbility/core';
export declare const CONTROLLER_METADATA: string;
export declare const CONTROLLER_INJECT_TOKEN: string;
export interface IController {
}
export declare abstract class Controller implements IController {
    private _context;
    private readonly _logger;
    constructor();
    private SetContext;
    protected get Context(): Context;
    protected get Logger(): ILogger;
}
export declare function IsController(target: any): any;
export declare function GetControllerName(controller: any): string;
export declare function GetAllControllers(): any[];
