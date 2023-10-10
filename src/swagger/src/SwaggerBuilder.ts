import Koa from 'koa';
import Router from 'koa-router';
import koaStatic from 'koa-static';
import { join } from 'path';
import { Inject, Injectable, GetInjectToken, Singleton, ISettingManager, SETTING_INJECT_TOKEN } from '@newbility/core';
import {
  AuthorizeInfo,
  GetAuthInfo,
  IsAllowAnonymous,
  GetAuthOptions,
  GetRouterInfo,
  GetAllControllers,
  GetActionParamsMetadata,
  GetActionInfo,
  GetHttpMethodStr,
  GetControllerName,
  IsController,
} from '@newbility/koa-core';
import {} from '@newbility/koa-core';

import { koaSwagger } from './koa2-swagger-ui/index';
import { SwaggerOptions } from './SwaggerOptions';

export const SWAGGER_BUILDER_INJECT_TOKEN = GetInjectToken('Sys:ISwaggerBuilder');
const SWAGGER_AUTH_KEY = 'Authorization';

interface SwaggerTag {
  name: string;
  description?: string;
}

interface SwaggerParameter {
  name: string;
  in: 'query' | 'body';
  required?: boolean;
  type: 'array' | 'string' | 'number' | 'object' | string;
  collectionFormat?: 'multi' | 'ssv' | string;
}

interface SwaggerResponse {
  description: string;
  schema: any;
}

interface ISwaggerPath {
  tags: string[];
  summary?: string;
  description?: string;
  produces: string[];
  parameters: Array<SwaggerParameter>;
  responses: { [key: number]: SwaggerResponse };
  security?: any;
}

class SwaggerPath implements ISwaggerPath {
  tags: string[];
  summary?: string | undefined;
  description?: string | undefined;
  produces: string[];
  parameters: SwaggerParameter[];
  responses: { [key: number]: SwaggerResponse };
  security?: any;

  constructor(tag: string, parameters?: Array<SwaggerParameter>, responses?: { [key: number]: SwaggerResponse }) {
    this.tags = [tag];
    this.produces = ['application/json'];

    if (parameters && parameters.length > 0) this.parameters = parameters;
    else this.parameters = [];

    if (responses) {
      this.responses = responses;
    } else {
      this.responses = {
        200: {
          description: '返回值',
          schema: {},
        },
      };
    }
  }
}

export interface ISwaggerBuilder {
  CreateSwaggerApi(app: Koa, options?: SwaggerOptions): void;
  GenSwaggerJson(authKey?: string): void;
}

@Injectable()
@Singleton(SWAGGER_BUILDER_INJECT_TOKEN)
export class SwaggerBuilder implements ISwaggerBuilder {
  private readonly _settingManager: ISettingManager;
  private readonly _apiPrefix: string;
  constructor(@Inject(SETTING_INJECT_TOKEN) settingManager: ISettingManager) {
    this._settingManager = settingManager;
    this._apiPrefix = settingManager.GetConfig<string>('apiPrefix') || 'api';
  }

  public CreateSwaggerApi(app: Koa, options?: SwaggerOptions): void {
    if (!options) options = {}; // Options默认值

    const authOptions = GetAuthOptions();

    const router = new Router();
    const swagger = this.GenSwaggerJson(!!authOptions ? SWAGGER_AUTH_KEY : undefined);

    if (options?.info) {
      if (options?.info?.description) swagger.info.description = options?.info?.description;
      if (options?.info?.title) swagger.info.title = options?.info?.title;
    }

    // Auth相关
    if (authOptions && options.auth) {
      swagger.securityDefinitions = {
        [SWAGGER_AUTH_KEY]: {
          description: 'Token授权,将Token放入Header中去授权验证,例子:Authorization:{Token}',
          name: 'Authorization',
          in: 'header',
          type: 'apiKey',
        },
      };
    }

    app.use(koaStatic(join(__dirname, 'koa2-swagger-ui'), { maxage: options.cacheMaxAge ?? 1000 * 60 * 60 })); // 允许浏览器进行304持久化,提升界面打开性能

    router.register('/swagger.json', ['get'], (ctx) => {
      ctx.set('Content-Type', 'application/json');
      ctx.body = swagger;
    });

    let swaggerPath = options.path ?? '/swagger';
    if (!swaggerPath.startsWith('/')) swaggerPath = `/${swaggerPath}`;
    router.register(
      swaggerPath,
      ['get'],
      koaSwagger({
        routePrefix: false,
        swaggerOptions: {
          url: '/swagger.json',
          schemes: ['https', 'http'],
          requestInterceptor: options.requestInterceptor,
          responseInterceptor: options.responseInterceptor,
          plugins: options.plugins,
          auth: options.auth,
        },
      })
    );

    app.use(router.routes());
    app.use(router.allowedMethods());
  }

  public GenSwaggerJson(authKey?: string): any {
    const controllers = GetAllControllers();
    const tags: Array<SwaggerTag> = [];
    const paths: {
      [key: string]: { [key: string]: ISwaggerPath };
    } = {};

    controllers.forEach((controller) => {
      const routerInfo = GetRouterInfo(controller);
      const routerPath = routerInfo?.path;
      if (!IsController(controller) || !routerPath) {
        return;
      }

      const tag = GetControllerName(controller);
      tags.push({
        name: tag,
        description: routerInfo.desc,
      });

      const propKeys = Object.getOwnPropertyNames(controller.prototype);
      const ctlAuthInfo: AuthorizeInfo | undefined = authKey ? GetAuthInfo(controller) : undefined;

      propKeys.forEach((propKey) => {
        if (propKey === 'constructor') return; // 跳过构造函数

        const action = controller.prototype[propKey];
        if (!action || typeof action !== 'function') return;

        const actionInfo = GetActionInfo(action);
        if (!actionInfo) return;

        const actionName = actionInfo.name;
        const fullPath = `/${this._apiPrefix}/${routerPath}/${actionName}`.replace(/\/{2,}/g, '/');
        const parameters: Array<SwaggerParameter> = [];
        const actionParams = GetActionParamsMetadata(action);
        if (actionParams) {
          actionParams.forEach((actionParam) => {
            if (actionParam.in === 'body') {
              parameters.push({
                name: 'data',
                in: 'body',
                type: 'object',
                collectionFormat: 'multi',
              });
            } else if (actionParam.in === 'query') {
              let key = 'query';
              if (actionParam.key) {
                key = actionParam.key;
              }

              let actionParamType: string = 'object';
              if (typeof actionParam.type === 'string') {
                actionParamType = actionParam.type.toLowerCase();
              } else {
                actionParamType = actionParam.type.name.toLowerCase();
              }

              parameters.push({
                in: 'query',
                name: key,
                type: actionParamType,
                collectionFormat: 'multi',
              });
            }
          });
        }
        const swaggerPath = new SwaggerPath(tag, parameters);
        if (actionInfo.desc) {
          swaggerPath.summary = actionInfo.desc;
        }

        if (authKey) {
          // 加上鉴权
          const skipAuth = IsAllowAnonymous(action);
          if (!skipAuth) {
            const actAuthInfo = GetAuthInfo(action);
            if (ctlAuthInfo || actAuthInfo) {
              swaggerPath.security = [{ [authKey]: [] }];
            }
          }
        }
        paths[fullPath] = { [GetHttpMethodStr(actionInfo.httpMethod)]: swaggerPath };
      });
    });

    return {
      swagger: '2.0',
      info: {
        description: 'Swagger api for newbility',
        version: '1.0.0',
        title: 'Newbility Swagger',
      },
      schemes: ['http', 'https'],
      tags: tags,
      paths: paths,
    };
  }
}
