import { CURRENT_USER_INJECT_TOKEN, ICurrentUser, Inject, Injectable, Transient, UserFriendlyError, Interceptor } from '@newbility/core';
import { HttpGet, RequestQuery, Controller, Router, HttpPost, RequestBody, Authorize, AllowAnonymous } from '@newbility/koa-core';
import { IJwtToken, JWT_TOKEN_INJECT_TOKEN } from '@newbility/koa-jwt';
import { TestInterceptor, TestInterceptor2 } from '../interceptor/TestInterceptor';

@Injectable()
@Transient()
@Authorize()
@Interceptor(TestInterceptor2)
@Router({ desc: 'Auth测试' })
export default class AuthController extends Controller {
  private readonly _jwtToken: IJwtToken;
  private readonly _currentUser: ICurrentUser;
  constructor(@Inject(JWT_TOKEN_INJECT_TOKEN) jwtToken: IJwtToken, @Inject(CURRENT_USER_INJECT_TOKEN) currentUser: ICurrentUser) {
    super();
    this._jwtToken = jwtToken;
    this._currentUser = currentUser;
  }

  @HttpGet()
  async GetUserInfo() {
    // const context = this.HttpContext.GetContext();
    // return context.state.user;

    return this._currentUser.GetUserInfo();
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
      // const options = GetAuthOptions();
      // const expiresIn = 2 * 60 * 60;
      // const token = jwt.sign(
      //   {
      //     userName: 'admin',
      //     roles: ['admin'],
      //   },
      //   options.secret,
      //   { expiresIn: expiresIn }
      // );
      // return {
      //   token: token,
      //   expiresIn: expiresIn,
      // };

      return this._jwtToken.GetJwtToken(
        {
          userName: 'admin',
          roles: ['admin'],
          ext: {
            id: '12345677',
            age: 18,
            dn: 'JamesHu',
          },
        },
        2 * 60 * 60
      );
    } else if (data.userName === 'admin1' && data.password === '123456') {
      return this._jwtToken.GetJwtToken(
        {
          userName: 'admin1',
          roles: ['admin'],
          ext: {
            id: '11111111111',
            age: 14,
            dn: '12121212121',
          },
        },
        2 * 60 * 60
      );
    }
    throw new UserFriendlyError('账号或者密码错误');
  }
}
