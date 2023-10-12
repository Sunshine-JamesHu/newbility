import Router from 'koa-router';
import Koa, { Context, Next } from 'koa';
import {
  GetInjectToken,
  Container,
  Inject,
  Injectable,
  Singleton,
  ILogger,
  LOGGER_INJECT_TOKEN,
  SETTING_INJECT_TOKEN,
  ISettingManager,
  UserFriendlyError,
} from '@newbility/core';
import { GetAllControllers, IController, IsController } from './Controller';
import { GetActionParamsMetadata } from '../router/RequestData';
import { GetRouterPath } from '../router/Router';
import { GetActionInfo, GetHttpMethodStr } from '../router/Request';
import { AuthorizeInfo, GetAuthInfo } from '../auth/Authorize';
import { IsAllowAnonymous } from '../auth/AllowAnonymous';
import { AUTHENTICATION_INJECT_TOKEN, IAuthentication } from '../auth/Authentication';
import { IPermissionChecker, PERMISSION_CHECKER_INJECT_TOKEN } from '../auth/PermissionChecker';

export const CTL_BUILDER_INJECT_TOKEN = GetInjectToken('Sys:IControllerBuilder');

export interface ActionDescriptor {
  fullPath: string;
  httpMethod: 'get' | 'post' | 'put' | 'delete' | 'options';
  func: (context: Context, next: Next) => Promise<any>;
  needAuth: boolean;
}

export interface IControllerBuilder {
  CreateControllers(): void;
}

@Injectable()
@Singleton(CTL_BUILDER_INJECT_TOKEN)
export class ControllerBuilder implements IControllerBuilder {
  private readonly _settingManager: ISettingManager;
  private readonly _logger: ILogger;
  private readonly _apiPrefix: string;
  private readonly _app: Koa;

  private readonly _authentication: IAuthentication | undefined;
  private readonly _permissionChecker: IPermissionChecker | undefined;

  constructor(
    @Inject(SETTING_INJECT_TOKEN) settingManager: ISettingManager,
    @Inject(LOGGER_INJECT_TOKEN) logger: ILogger,
    @Inject(GetInjectToken('Sys:App')) app: Koa
  ) {
    this._settingManager = settingManager;
    this._logger = logger;
    this._apiPrefix = settingManager.GetConfig<string>('apiPrefix') || 'api';
    this._app = app;

    try {
      this._authentication = Container.resolve<IAuthentication>(AUTHENTICATION_INJECT_TOKEN);
    } catch (error) {
      this._logger.LogWarn('尚未配置[IAuthentication]组件');
    }

    try {
      this._permissionChecker = Container.resolve<IPermissionChecker>(PERMISSION_CHECKER_INJECT_TOKEN);
    } catch (error) {
      this._logger.LogWarn('尚未配置[IPermissionChecker]组件');
    }
  }

  public CreateControllers(): void {
    const controllers = GetAllControllers();
    if (controllers && controllers.length) {
      const notAuthRouter = new Router();
      const authRouter = new Router();
      controllers.forEach((controller) => {
        const actions = this.GetControllerActionDescriptors(controller);
        if (actions && actions.length) {
          actions.forEach((action) => {
            this._logger.LogDebug(`Action:${action.fullPath}`);
            if (action.needAuth) {
              authRouter.register(action.fullPath, [action.httpMethod], action.func);
            } else {
              notAuthRouter.register(action.fullPath, [action.httpMethod], action.func);
            }
          });
        }
      });

      const router = new Router();
      router.use(notAuthRouter.routes(), notAuthRouter.allowedMethods());

      const authMiddlewares: any[] = [authRouter.routes(), authRouter.allowedMethods()];
      if (this._authentication) {
        authMiddlewares.unshift((ctx: any, next: any) => this._authentication?.Authentication(ctx, next));
        authMiddlewares.unshift((ctx: any, next: any) => this._authentication?.UnAuthorized(ctx, next));
      }
      router.use(...authMiddlewares);

      // 需要鉴权的接口
      this._app.use(router.routes());
      this._app.use(router.allowedMethods());
    }
  }

  protected GetControllerActionDescriptors(controller: Function): ActionDescriptor[] | undefined {
    const routerPath = GetRouterPath(controller);
    if (!IsController(controller) || !routerPath) {
      return;
    }

    const actions: ActionDescriptor[] = [];
    this._logger.LogDebug(`Create Controller: ${controller.name} -> ${routerPath}`);
    const propKeys = Object.getOwnPropertyNames(controller.prototype);

    const ctlAuthInfo = GetAuthInfo(controller);

    propKeys.forEach((propKey) => {
      if (propKey === 'constructor') return; // 跳过构造函数

      const ctlAction = controller.prototype[propKey];
      if (!ctlAction || typeof ctlAction !== 'function') return;

      const actionInfo = GetActionInfo(ctlAction);
      if (!actionInfo) return;

      const actionName = actionInfo.name;
      const fullPath = `/${this._apiPrefix}/${routerPath}/${actionName}`.replace(/\/{2,}/g, '/');

      let needAuth = false;
      const actionAuthInfo = GetAuthInfo(ctlAction);
      if (ctlAuthInfo || actionAuthInfo) {
        needAuth = true;
      }
      const allowAnonymous = IsAllowAnonymous(ctlAction);
      if (allowAnonymous) {
        needAuth = false;
      }

      let mainFunc = async (ctx: Context, next: Next) => {
        const actionParams = GetActionParamsMetadata(ctlAction);
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
        const controllerIns: any = Container.resolve<IController>(controller as any);
        // controllerIns.SetContext(ctx); // 将Ctx丢进去
        const result = ctlAction.apply(controllerIns, args); // 执行函数

        if (result instanceof Promise) {
          ctx.response.body = await result; // 处理异步
        } else {
          ctx.response.body = result; // 处理同步
        }
      };

      if (needAuth) {
        mainFunc = this.GetPermissionCheckerAction(actionAuthInfo || ctlAuthInfo, mainFunc);
      }

      const action: ActionDescriptor = {
        fullPath,
        httpMethod: GetHttpMethodStr(actionInfo.httpMethod) as any,
        func: mainFunc,
        needAuth: needAuth,
      };

      actions.push(action);
    });
    return actions;
  }

  protected GetPermissionCheckerAction(authInfo: AuthorizeInfo, func: (context: Context, next: Next) => Promise<any>) {
    return async (context: Context, next: Next) => {
      let isGranted: boolean;

      if (!this._permissionChecker) {
        isGranted = true;
      } else {
        const isGrantedTask = this._permissionChecker.IsGranted(context.state.user, authInfo);
        if (isGrantedTask instanceof Promise) {
          isGranted = await isGrantedTask;
        } else {
          isGranted = isGrantedTask;
        }
      }

      if (!isGranted) {
        throw new UserFriendlyError('Permission denied', { detail: '权限不足' });
      } else {
        return await func(context, next);
      }
    };
  }
}
