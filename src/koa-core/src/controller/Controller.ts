import { Context } from 'koa';
import { GetMetadata, GetMetadataKey, Metadata } from '../../../core/src/metadata/Metadata';
import { Abstract, Container, GetInjectToken, Transient } from '../../../core/src/di/Dependency';
import { ILogger, LOGGER_INJECT_TOKEN } from '../../../core/src/logger/Logger';

export const CONTROLLER_METADATA = GetMetadataKey('Sys:Controller');
export const CONTROLLER_INJECT_TOKEN = GetInjectToken('Sys:Controller');

export interface IController {}

@Metadata(CONTROLLER_METADATA, true)
@Abstract()
export abstract class Controller implements IController {
  private _context: Context | undefined;
  private readonly _logger: ILogger;

  constructor() {
    console.log('初始化Controller');
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

export const CTL_MODULE_INJECT_TOKEN = GetInjectToken('Sys:AllControllerModule');
export function GetAllControllerModule() {
  if (Container.isRegistered(CTL_MODULE_INJECT_TOKEN)) {
    return Container.resolveAll<any>(CTL_MODULE_INJECT_TOKEN);
  }
  return [];
}

export function SetControllerModule(module: any) {
  Container.registerInstance(CTL_MODULE_INJECT_TOKEN, module);
}
