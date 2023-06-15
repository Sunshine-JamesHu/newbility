import jwt from 'koa-jwt';
import { Context, Next } from 'koa';
import { Singleton } from '@newbility/core';
import { Authentication, AUTHENTICATION_INJECT_TOKEN } from '../koa-core/auth/Authentication';
import { GetAuthOptions } from '../koa-core/auth/Auth';

@Singleton(AUTHENTICATION_INJECT_TOKEN)
export class JwtAuthentication extends Authentication {
  private readonly _unlessPaths = [/^\/swagger/, /^\/favicon/]; // swagger被放在受保护的资源后方
  private readonly _options: jwt.Options;
  constructor() {
    super();
    this._options = GetAuthOptions();
  }

  async Authentication(context: Context, next: Next): Promise<any> {
    if (this._options && this._options.secret) {
      const func = jwt(this._options).unless({ path: [...this._unlessPaths] });
      return func(context, next);
    } else {
      return await next();
    }
  }
}
