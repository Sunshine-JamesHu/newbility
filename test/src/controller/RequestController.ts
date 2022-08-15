import { HttpGet, HttpPost, Controller, RequestBody, RequestQuery, Router } from '@newbility/koa-core';
import { Injectable, Transient } from '@newbility/core';

@Injectable()
@Transient()
@Router({ desc: '请求测试' })
export default class RequestController extends Controller {
  @HttpGet()
  GetTest(@RequestQuery('key') key: string) {
    return key;
  }
}
