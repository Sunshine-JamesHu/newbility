import { GetInjectToken } from '@newbility/core';
import { Context, Next } from 'koa';

export const AUTHENTICATION_INJECT_TOKEN = GetInjectToken('Sys:Auth:Authentication');

export interface IAuthentication {
  Authentication(context: Context, next: Next): Promise<any>;
  UnAuthorized(context: Context, next: Next): Promise<any>;
}

export abstract class Authentication implements IAuthentication {
  abstract Authentication(context: Context, next: Next): Promise<any>;

  public UnAuthorized(context: Context, next: Next): Promise<any> {
    return next().catch((err) => {
      if (err.status == 401) {
        context.status = 401;
        context.body = {
          status: 401,
          error: '受保护的资源,请登录后重试~',
        };
      } else {
        throw err;
      }
    });
  }
}
