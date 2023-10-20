import Koa, { Middleware } from 'koa';
import cors from 'koa2-cors';
import koaBody from 'koa-body';
import koaStatic from 'koa-static';
import koaCompose from 'koa-compose';
import koaMount from 'koa-mount';
import koaCompress from 'koa-compress';

import {
  Container,
  GetInjectToken,
  ILogger,
  ISettingManager,
  Inject,
  Injectable,
  LOGGER_INJECT_TOKEN,
  SETTING_INJECT_TOKEN,
  Singleton,
  UserFriendlyError,
} from '@newbility/core';

import { AUTHENTICATION_INJECT_TOKEN, IAuthentication } from '../auth/Authentication';
import { run } from '../context/HttpContextStorage';

export const MIDDLEWARE_INIT_INJECT_TOKEN = GetInjectToken('Sys:MiddlewareInitializer');

export interface IMiddlewareInitializer {
  InitMiddleware(): void;
  AddMiddleware(middleware: Middleware): void;
}

@Injectable()
@Singleton(MIDDLEWARE_INIT_INJECT_TOKEN)
export class MiddlewareInitializer implements IMiddlewareInitializer {
  protected readonly KoaApp: Koa;
  protected readonly Setting: ISettingManager;
  protected readonly Logger: ILogger;
  protected readonly Middlewares: Koa.Middleware[];

  constructor(
    @Inject(GetInjectToken('Sys:App')) app: Koa,
    @Inject(SETTING_INJECT_TOKEN) setting: ISettingManager,
    @Inject(LOGGER_INJECT_TOKEN) logger: ILogger
  ) {
    this.KoaApp = app;
    this.Setting = setting;
    this.Logger = logger;
    this.Middlewares = [];

    this.AddSystemMiddleware();
  }

  InitMiddleware(): void {
    for (let index = 0; index < this.Middlewares.length; index++) {
      const middleware = this.Middlewares[index];
      this.KoaApp.use(middleware);
    }
  }

  AddMiddleware(middleware: Middleware): void {
    this.Middlewares.push(middleware);
  }

  protected AddSystemMiddleware() {
    this.AddGlobalError();
    this.AddCors();
    this.AddCompress();
    this.AddStaticResource();
    this.AddKoaBody();
    this.AddHttpContextStorage();
  }

  //#region 系统组件

  protected AddGlobalError() {
    this.AddMiddleware(async (ctx, next) => {
      try {
        await next();
      } catch (error: any) {
        let errorData = { msg: error.message };
        if (error instanceof UserFriendlyError) {
          ctx.status = error.status ?? 403;
          if (error.data) {
            errorData = { ...errorData, ...error.data };
          }
          ctx.body = errorData;
        } else {
          this.Logger.LogError(error);
          ctx.status = 500;
          ctx.body = errorData;
        }
      }
    });
  }

  protected AddCors() {
    const enableCors = this.Setting.GetConfig<boolean>('cors:enable');
    if (enableCors) {
      const options = this.Setting.GetConfig<cors.Options>('cors:options');
      this.AddMiddleware(cors(options));
    }
  }

  protected AddCompress() {
    this.AddMiddleware(
      koaCompress({
        filter: (contentType) => {
          // 压缩Filter
          return /html|text|javascript|css|json/i.test(contentType);
        },
        threshold: 128 * 1024, // 超过128k就压缩
        br: false, // br性能有问题
      })
    );
  }

  protected AddStaticResource() {
    let staticCfg = this.Setting.GetConfig<{ [key: string]: { dir: string; auth?: boolean; options?: any } }>('static');

    if (!staticCfg) staticCfg = {};
    if (!staticCfg.default) staticCfg.default = { dir: `${__dirname}/../public`, options: { maxage: 1000 * 60 * 60 } };

    let authentication: IAuthentication | undefined;
    if (Container.isRegistered(AUTHENTICATION_INJECT_TOKEN)) {
      authentication = Container.resolve<IAuthentication>(AUTHENTICATION_INJECT_TOKEN);
    }
    for (const key in staticCfg) {
      if (Object.prototype.hasOwnProperty.call(staticCfg, key)) {
        const sCfg = staticCfg[key];
        if (key === 'default') {
          this.AddMiddleware(koaStatic(sCfg.dir, sCfg.options));
        } else {
          if (sCfg.auth && authentication) {
            const authStaticMiddleware = koaCompose([
              (ctx, next) => {
                return authentication?.UnAuthorized(ctx, next);
              },
              (ctx, next) => {
                return authentication?.Authentication(ctx, next);
              },
              koaStatic(sCfg.dir, sCfg.options),
            ]);
            this.AddMiddleware(koaMount(`/${key}`, authStaticMiddleware));
          } else {
            this.AddMiddleware(koaMount(`/${key}`, koaStatic(sCfg.dir, sCfg.options)));
          }
        }
      }
    }
  }

  protected AddKoaBody() {
    let maxFileSize = this.Setting.GetConfig<number | undefined>('maxFileSize');
    if (!maxFileSize) maxFileSize = 200 * 1024 * 1024;

    this.AddMiddleware(
      koaBody({
        parsedMethods: ['POST', 'PUT', 'PATCH', 'DELETE', 'GET', 'HEAD'],
        multipart: true,
        formidable: {
          maxFileSize: maxFileSize,
        },
      })
    );
  }

  protected AddHttpContextStorage() {
    this.AddMiddleware(run);
  }

  //#endregion
}
