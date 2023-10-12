import jwt from 'koa-jwt';
import { Context, Next } from 'koa';
import { Singleton } from '@newbility/core';
import { Authentication, AUTHENTICATION_INJECT_TOKEN } from '../koa-core/auth/Authentication';
import { GetAuthOptions } from '../koa-core/auth/Auth';

@Singleton(AUTHENTICATION_INJECT_TOKEN)
export class JwtAuthentication extends Authentication {
  async Authentication(context: Context, next: Next): Promise<any> {
    const options = GetAuthOptions();
    if (options && options.secret) {
      const func = jwt(options);
      return func(context, next);
    } else {
      return await next();
    }
  }
}
