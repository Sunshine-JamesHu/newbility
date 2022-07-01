import * as path from 'path';
import * as fs from 'fs';
import Router from 'koa-router';
import Koa, { Context, Next } from 'koa';
import { container } from 'tsyringe';
import { IController, IsController, SetControllerModule } from './Controller';
import { Container, GetInjectToken, Inject, Injectable, IsAbstract, Singleton } from '../../../core/src/di/Dependency';
import { GetActionParamsMetadata } from '../router/RequestData';
import { GetRouterPath } from '../router/Router';
import { GetActionInfo, GetHttpMethodStr } from '../router/Request';
import { ILogger, LOGGER_INJECT_TOKEN } from '../../../core/src/logger/Logger';
import { SETTING_INJECT_TOKEN, ISettingManager } from '../../../core/src/setting/SettingManager';

export const CTL_BUILDER_INJECT_TOKEN = GetInjectToken('Sys:IControllerBuilder');

interface ActionDescriptor {
  fullPath: string;
  httpMethod: 'get' | 'post' | 'put' | 'delete' | 'options';
  func: (context: Context, next: Next) => Promise<any>;
}

export interface IControllerBuilder {
  CreateController(module: Function): void;
  CreateControllerByModule(app: Koa, modulePath: string): void;
}

@Injectable()
@Singleton(CTL_BUILDER_INJECT_TOKEN)
export class ControllerBuilder implements IControllerBuilder {
  private readonly _settingManager: ISettingManager;
  private readonly _logger: ILogger;
  private readonly _apiPrefix: string;

  constructor(@Inject(SETTING_INJECT_TOKEN) settingManager: ISettingManager, @Inject(LOGGER_INJECT_TOKEN) logger: ILogger) {
    this._settingManager = settingManager;
    this._logger = logger;
    this._apiPrefix = settingManager.GetConfig<string>('apiPrefix') || 'api';
  }

  public CreateController(module: Function): ActionDescriptor[] | undefined {
    const routerPath = GetRouterPath(module);
    if (!IsController(module) || !routerPath) {
      return;
    }

    SetControllerModule(module); // 放入总容器中,供其他模块使用

    const actions: ActionDescriptor[] = [];
    this._logger.LogDebug(`Create Controller: ${module.name} -> ${routerPath}`);
    const propKeys = Object.getOwnPropertyNames(module.prototype);
    propKeys.forEach((propKey) => {
      if (propKey === 'constructor') return; // 跳过构造函数

      const property = module.prototype[propKey];
      if (!property || typeof property !== 'function') return;

      const actionInfo = GetActionInfo(property);
      if (!actionInfo) return;

      const actionName = actionInfo.name;
      const fullPath = `/${this._apiPrefix}/${routerPath}/${actionName}`.replace(/\/{2,}/g, '/');

      const mainFunc = async (ctx: Context, next: Next) => {
        const actionParams = GetActionParamsMetadata(property);
        const args: any = [];
        if (actionParams && actionParams.length) {
          actionParams.forEach((element) => {
            let data: any = null;
            if (element.in === 'body') {
              data = ctx.request.body;

              // 处理FormData中带files的场景
              if (ctx.request.files) {
                if (!data) data = {};
                for (const key in ctx.request.files) {
                  if (Object.prototype.hasOwnProperty.call(ctx.request.files, key)) {
                    const element = ctx.request.files[key];
                    data[key] = element;
                  }
                }
              }
            } else if (element.in === 'query') {
              const queryData = { ...ctx.params, ...ctx.query };
              data = queryData;
              if (element.key) {
                data = queryData[element.key];

                // 单独处理Array
                if (element.type.name.toLowerCase() === 'array' && !Array.isArray(data)) {
                  data = [data];
                }
              }
            }

            if (data != null) args[element.index] = data;
          });
        }
        const controller: any = container.resolve<IController>(module as any);
        controller.SetContext(ctx); // 将Ctx丢进去
        const result = property.apply(controller, args); // 执行函数

        if (result instanceof Promise) {
          ctx.response.body = await result; // 处理异步
        } else {
          ctx.response.body = result; // 处理同步
        }
      };

      const action: ActionDescriptor = {
        fullPath,
        httpMethod: GetHttpMethodStr(actionInfo.httpMethod) as any,
        func: mainFunc,
      };

      actions.push(action);
    });
    return actions;
  }

  public CreateControllerByModule(app: Koa, modulePath: string): void {
    const controllers = this.GetControllerByPath(modulePath);

    if (!controllers || !controllers.length) return;

    const router = new Router(); // 定义路由容器
    controllers.forEach((element) => {
      const actions = this.CreateController(element);
      if (actions && actions.length) {
        actions.forEach((action) => {
          this._logger.LogDebug(`Action:${action.fullPath}`);
          router.register(action.fullPath, [action.httpMethod], action.func);
        });
      }
    });

    app.use(router.routes());
    app.use(router.allowedMethods());
  }

  private GetControllerByPath(modulePath: string): any[] {
    let files: any[] = [];
    try {
      files = fs.readdirSync(modulePath);
    } catch (error) {
      console.error('Module路径配置错误,请检查配置后重试.');
      files = [];
    }
    let controllers: any[] = [];
    files.forEach((filePath) => {
      const fullFilePath = path.join(modulePath, filePath);
      if (fs.statSync(fullFilePath).isDirectory()) {
        const tmp = this.GetControllerByPath(fullFilePath);
        controllers = controllers.concat(tmp);
      } else {
        const extName = path.extname(fullFilePath);
        if (fullFilePath.endsWith('.d.ts')) return; // 单独去掉.d.ts这个描述文件

        if (extName === '.ts' || extName === '.js') {
          const modules: any[] = require(fullFilePath);
          if (!modules) return;

          for (const key in modules) {
            if (Object.prototype.hasOwnProperty.call(modules, key)) {
              const module = modules[key];

              if (module.prototype && !IsAbstract(module) && IsController(module)) {
                controllers.push(module);
              }
            }
          }
        }
      }
    });

    return controllers;
  }
}
