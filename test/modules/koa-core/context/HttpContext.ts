import { GetInjectToken, Singleton } from '@newbility/core';
import { Context } from 'koa';
import { useContext } from './HttpContextStorage';

export const HTTP_CONTEXT_INJECT_TOKEN = GetInjectToken('Sys:HttpContext');

export interface IHttpContext {
  GetContext(): Context;
}

@Singleton(HTTP_CONTEXT_INJECT_TOKEN)
export class HttpContext implements IHttpContext {
  GetContext(): Context {
    return useContext();
  }
}
