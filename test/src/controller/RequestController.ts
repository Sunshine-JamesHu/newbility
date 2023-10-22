import { HttpGet, HttpPost, Controller, RequestBody, RequestQuery, Router } from '@newbility/koa-core';
import { Injectable, Transient, NewbilityError, UserFriendlyError, UserFriendlyErrorData, Container } from '@newbility/core';
import { ITestService } from '../service/TestService';

@Injectable()
@Transient()
@Router({ desc: '请求测试' })
export default class RequestController extends Controller {
  @HttpGet()
  GetTest(@RequestQuery('key') key: string) {
    return {
      name: 'GetTest',
      data: key,
    };
  }

  @HttpPost()
  PostTest(@RequestBody() data: any) {
    return {
      name: 'PostTest',
      data: data,
    };
  }

  @HttpPost()
  ErrorTest(@RequestBody() data: any) {
    throw new UserFriendlyError('主动抛出错误', {
      detail: '呀呀呀',
    });
  }

  @HttpPost()
  async AsyncErrorTest(@RequestBody() data: any) {
    const text = await Promise.resolve('AsyncTestError');
    console.log(text);
    throw new UserFriendlyError('主动抛出错误', {
      detail: text,
    });
  }

  @HttpPost()
  ErrorTest2(@RequestBody() data: any) {
    throw new NewbilityError('主动抛出错误', {
      detail: '主动抛出一个错误',
    });
  }

  @HttpPost()
  ErrorTest3(@RequestBody() data: any) {
    const obj: any = {};
    obj.a.b = 18;
  }

  @HttpGet()
  GetTest2() {
    const svc = Container.resolve<ITestService>('TestService');
    return svc.Test();
  }
}
