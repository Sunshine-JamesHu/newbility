import { Injectable, Transient, Inject } from '@newbility/core';
import { HttpGet, HttpPost, Controller, RequestBody, RequestQuery, Router } from '@newbility/koa-core';
import { IHttpClient, HTTP_CLIENT_INJECT_TOKEN } from '@newbility/http-client-core';

@Injectable()
@Transient()
@Router({ desc: 'Http请求测试' })
export default class HttpController extends Controller {
  constructor(@Inject(HTTP_CLIENT_INJECT_TOKEN) private readonly _httpClient: IHttpClient) {
    super();
  }

  @HttpGet()
  async GetTest(@RequestQuery('key') key: string) {
    const res = await this._httpClient.Get({ url: 'http://127.0.0.1:28000/api/request/getTest', params: { key } });
    return {
      name: 'HttpClient-GetTest',
      data: res,
    };
  }

  @HttpPost()
  async PostTest(@RequestBody() data: any) {
    const res = await this._httpClient.Post({ url: 'http://127.0.0.1:28000/api/request/postTest', data: data });
    return {
      name: 'HttpClient-PostTest',
      data: res,
    };
  }

  @HttpPost()
  async ErrorPostTest(@RequestBody() data: any) {
    const res = await this._httpClient.Post({ url: 'http://127.0.0.1:28000/api/request/errorTest', data: data });
    return {
      name: 'HttpClient-PostTest',
      data: res,
    };
  }
}
