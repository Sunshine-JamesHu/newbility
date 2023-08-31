import { GetInjectToken } from '../di/Dependency';

export const CURRENT_USER_INJECT_TOKEN = GetInjectToken('Sys:CurrentUser');

export interface UserInfo {
  userName: string;
  roles?: string[];
  policies?: string[];
  [key: string]: any;
}

export interface ICurrentUser {
  GetUserInfo(): UserInfo;
}
