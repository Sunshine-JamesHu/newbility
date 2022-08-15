import { HttpGet } from '../../src/koa-core/src/router/Request';
import { Controller } from '../../src/koa-core/src/controller/Controller';
import { RequestQuery } from '../../src/koa-core/src/router/RequestData';
import { Router } from '../../src/koa-core/src/router/Router';
import { Injectable, Transient } from '../../src/core/src/di/Dependency';

@Injectable()
@Transient()
@Router({ desc: '请求测试' })
export default class RequestController extends Controller {
  @HttpGet()
  GetTest(@RequestQuery('key') key: string) {
    return key;
  }
}
