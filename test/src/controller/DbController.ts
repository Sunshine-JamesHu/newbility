import { Injectable, Transient } from '@newbility/core';
import { HttpGet, HttpPost, Controller, RequestBody, RequestQuery, Router } from '@newbility/koa-core';

@Injectable()
@Transient()
@Router({ desc: '数据库测试' })
export default class DbController extends Controller {
  @HttpPost()
  Create(@RequestBody() data: any) {
    return data;
  }

  @HttpGet()
  Query(@RequestQuery('key') key: string) {
    return key;
  }
}
