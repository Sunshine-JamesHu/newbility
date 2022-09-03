import { GetInjectToken, Container, ILogger, LOGGER_INJECT_TOKEN, Abstract } from '@newbility/core';

export const HTTP_CLIENT_INJECT_TOKEN = GetInjectToken('Sys:IHttpClient');

export type HttpMethod =
  | 'get'
  | 'GET'
  | 'delete'
  | 'DELETE'
  | 'head'
  | 'HEAD'
  | 'options'
  | 'OPTIONS'
  | 'post'
  | 'POST'
  | 'put'
  | 'PUT'
  | 'patch'
  | 'PATCH'
  | 'link'
  | 'LINK'
  | 'unlink'
  | 'UNLINK';

export type ResponseType = 'arraybuffer' | 'blob' | 'document' | 'json' | 'text' | 'stream';

export interface RequestOptions {
  url: string;
  method?: HttpMethod;
  headers?: { [key: string]: string };
  params?: any;
  data?: any;
  timeout?: number;
  timeoutErrorMessage?: string;
  responseType?: ResponseType;
}

export interface HttpClientResult<TResult = any> {
  status: number;
  data?: TResult;
}

export interface IHttpClient {
  Get<TResult = any>(config: RequestOptions): Promise<HttpClientResult<TResult>>;
  Post<TResult = any>(config: RequestOptions): Promise<HttpClientResult<TResult>>;
  Put<TResult = any>(config: RequestOptions): Promise<HttpClientResult<TResult>>;
  Delete<TResult = any>(config: RequestOptions): Promise<HttpClientResult<TResult>>;
  Send<TResult = any>(config: RequestOptions): Promise<HttpClientResult<TResult>>;
}

@Abstract()
export abstract class HttpClientBase implements IHttpClient {
  protected readonly Logger: ILogger;
  constructor() {
    this.Logger = Container.resolve<ILogger>(LOGGER_INJECT_TOKEN);
  }

  Get<TResult = any>(config: RequestOptions): Promise<HttpClientResult<TResult>> {
    return this.Send<TResult>({ ...config, method: 'get' });
  }

  Post<TResult = any>(config: RequestOptions): Promise<HttpClientResult<TResult>> {
    return this.Send<TResult>({ ...config, method: 'post' });
  }

  Put<TResult = any>(config: RequestOptions): Promise<HttpClientResult<TResult>> {
    return this.Send<TResult>({ ...config, method: 'put' });
  }

  Delete<TResult = any>(config: RequestOptions): Promise<HttpClientResult<TResult>> {
    return this.Send<TResult>({ ...config, method: 'delete' });
  }

  abstract Send<TResult = any>(config: RequestOptions): Promise<HttpClientResult<TResult>>;
}
