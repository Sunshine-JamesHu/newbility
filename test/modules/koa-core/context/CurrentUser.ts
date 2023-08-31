import { ICurrentUser, Singleton, UserInfo, CURRENT_USER_INJECT_TOKEN, Inject, Injectable } from '@newbility/core';
import { HTTP_CONTEXT_INJECT_TOKEN, IHttpContext } from './HttpContext';

@Singleton(CURRENT_USER_INJECT_TOKEN)
@Injectable()
export class CurrentUser implements ICurrentUser {
  private readonly _httpContext: IHttpContext;
  constructor(@Inject(HTTP_CONTEXT_INJECT_TOKEN) httpContext: IHttpContext) {
    this._httpContext = httpContext;
  }

  public GetUserInfo(): UserInfo {
    const context = this._httpContext.GetContext();
    const user = context.state.user;
    return user;
  }
}
