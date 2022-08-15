import { HttpGet, HttpPost } from '../../src/koa-core/src/router/Request';
import { Controller } from '../../src/koa-core/src/controller/Controller';
import { RequestBody, RequestQuery } from '../../src/koa-core/src/router/RequestData';
import { Router } from '../../src/koa-core/src/router/Router';
import { Injectable, Transient } from '../../src/core/src/di/Dependency';

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
