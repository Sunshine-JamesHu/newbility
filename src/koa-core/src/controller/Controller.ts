import {
  GetMetadata,
  GetMetadataKey,
  Metadata,
  Abstract,
  Container,
  GetInjectToken,
  ILogger,
  LOGGER_INJECT_TOKEN,
  SC_INJECT_TOKEN,
  IServiceCollection,
} from '@newbility/core';
import { HTTP_CONTEXT_INJECT_TOKEN, IHttpContext } from '../context/HttpContext';

export const CONTROLLER_METADATA = GetMetadataKey('Sys:Controller');
export const CONTROLLER_INJECT_TOKEN = GetInjectToken('Sys:Controller');

export interface IController {}

@Metadata(CONTROLLER_METADATA, true)
@Abstract()
export abstract class Controller implements IController {
  private readonly _httpContext: IHttpContext;

  // private _context: Context | undefined;
  private readonly _logger: ILogger;

  constructor() {
    this._logger = Container.resolve<ILogger>(LOGGER_INJECT_TOKEN);
    this._httpContext = Container.resolve<IHttpContext>(HTTP_CONTEXT_INJECT_TOKEN);
  }

  // // 系统会调用该函数
  // private SetContext(ctx: Context): void {
  //   this._context = ctx;
  // }

  // protected get Context(): Context {
  //   return this.HttpContext.GetContext();
  // }

  protected get Logger() {
    return this._logger;
  }

  protected get HttpContext() {
    return this._httpContext;
  }
}

export function IsController(target: any) {
  return GetMetadata(CONTROLLER_METADATA, target);
}

export function GetControllerName(controller: any): string {
  return controller.name.replace('Controller', '');
}

export function GetAllControllers() {
  const sc = Container.resolve<IServiceCollection>(SC_INJECT_TOKEN);
  const services = sc.GetServices();

  const controllers: any[] = [];
  services.forEach((element) => {
    if (IsController(element)) controllers.push(element);
  });

  return controllers;
}
