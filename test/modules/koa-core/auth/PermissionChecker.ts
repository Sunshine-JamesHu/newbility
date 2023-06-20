import { GetInjectToken, Singleton } from '@newbility/core';
import { AuthorizeInfo } from './Authorize';

export const PERMISSION_CHECKER_INJECT_TOKEN = GetInjectToken('Sys:Auth:PermissionChecker');

export interface IPermissionChecker {
  IsGranted(userInfo: any, authInfo: AuthorizeInfo): Promise<boolean> | boolean;
}

@Singleton(PERMISSION_CHECKER_INJECT_TOKEN)
export class PermissionChecker implements IPermissionChecker {
  IsGranted(userInfo: any, authInfo: AuthorizeInfo): Promise<boolean> | boolean {
    let isGranted = false;
    if ((!authInfo.policies || !authInfo.policies.length) && (!authInfo.roles || !authInfo.roles.length)) {
      isGranted = true;
    }

    if (!isGranted && authInfo.policies && authInfo.policies.length) {
      const policies: string[] = userInfo.policies || userInfo.data?.policies || [];
      for (let index = 0; index < authInfo.policies.length; index++) {
        const policy = authInfo.policies[index];
        if (policies.indexOf(policy) > -1) {
          isGranted = true;
          break;
        }
      }
    }

    if (!isGranted && authInfo.roles && authInfo.roles.length) {
      const roles: string[] = userInfo.roles || userInfo.data?.userInfo || [];
      for (let index = 0; index < authInfo.roles.length; index++) {
        const role = authInfo.roles[index];
        if (roles.indexOf(role) > -1) {
          isGranted = true;
          break;
        }
      }
    }
    return isGranted;
  }
}
