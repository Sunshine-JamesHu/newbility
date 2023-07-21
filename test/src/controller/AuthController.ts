import { Injectable, Transient, UserFriendlyError } from '@newbility/core';
import { HttpGet, Controller, RequestQuery, Router, HttpPost, RequestBody } from '@newbility/koa-core';
import { Authorize } from '../../modules/koa-core/auth/Authorize';
import { AllowAnonymous } from '../../modules/koa-core/auth/AllowAnonymous';
import jwt from 'jsonwebtoken';
import { GetAuthOptions } from '../../modules/koa-core/auth/Auth';
import { Interceptor } from '../interceptor/Interceptor';
import { TestInterceptor, TestInterceptor2 } from '../interceptor/TestInterceptor';

@Injectable()
@Transient()
@Authorize()
@Interceptor(TestInterceptor2)
@Router({ desc: 'Auth测试' })
export default class AuthController extends Controller {
  @HttpGet()
  async GetUserInfo() {
    return this.Context.state.user;
  }

  @HttpGet()
  @Authorize({ roles: ['admin2'] })
  Auth2(@RequestQuery('key') key: string) {
    return {
      name: 'Auth2',
      data: key,
    };
  }

  @HttpGet()
  @Authorize({ roles: ['admin'] })
  RoleAuth(@RequestQuery('key') key: string) {
    return {
      name: 'Auth2',
      data: key,
    };
  }

  @HttpGet()
  @AllowAnonymous()
  NotAuth(@RequestQuery('key') key: string) {
    return {
      name: 'NotAuth',
      data: key,
    };
  }

  @HttpGet()
  @AllowAnonymous()
  @Interceptor(TestInterceptor)
  NotAuth2(@RequestQuery('key') key: string) {
    return {
      name: 'NotAuth',
      data: key,
    };
  }

  @AllowAnonymous()
  @HttpPost()
  Login(@RequestBody() data: any) {
    if (data.userName === 'admin' && data.password === '123456') {
      const options = GetAuthOptions();
      const expiresIn = 2 * 60 * 60;
      const token = jwt.sign(
        {
          userName: 'admin',
          roles: ['admin'],
        },
        options.secret,
        { expiresIn: expiresIn }
      );
      return {
        token: token,
        expiresIn: expiresIn,
      };
    }
    throw new UserFriendlyError('账号或者密码错误');
  }
}
