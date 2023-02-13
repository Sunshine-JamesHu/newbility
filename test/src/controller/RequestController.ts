import { HttpGet, HttpPost, Controller, RequestBody, RequestQuery, Router } from '@newbility/koa-core';
import { Injectable, Transient, NewbilityError, UserFriendlyError, UserFriendlyErrorData } from '@newbility/core';

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
}
