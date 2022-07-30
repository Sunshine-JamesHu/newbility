import { Context } from 'koa';
import { GetMetadata, GetMetadataKey, Metadata } from '../../../core/src/metadata/Metadata';
import { Abstract, Container, GetInjectToken, Transient } from '../../../core/src/di/Dependency';
import { ILogger, LOGGER_INJECT_TOKEN } from '../../../core/src/logger/Logger';
import { SC_INJECT_TOKEN, IServiceCollection } from '../../../core/src/di/ServiceCollection';

export const CONTROLLER_METADATA = GetMetadataKey('Sys:Controller');
export const CONTROLLER_INJECT_TOKEN = GetInjectToken('Sys:Controller');

export interface IController {}

@Metadata(CONTROLLER_METADATA, true)
@Abstract()
export abstract class Controller implements IController {
  private _context: Context | undefined;
  private readonly _logger: ILogger;

  constructor() {
    this._logger = Container.resolve<ILogger>(LOGGER_INJECT_TOKEN);
  }

  // 系统会调用该函数
  private SetContext(ctx: Context): void {
    this._context = ctx;
  }

  protected get Context(): Context {
    return this._context as Context;
  }

  protected get Logger() {
    return this._logger;
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
