import { GetMetadataKey, GetMetadata, DefineMetadata } from '@newbility/core';

const METADATA_AUTHORIZE_INFO = GetMetadataKey('Sys:Auth:AuthorizeInfo');

export interface AuthorizeInfo {
  policies?: string[];
  roles?: string[];
}

export function Authorize(policies?: string | string[], roles?: string | string[]) {
  const func: any = (target: any, key?: string, descriptor?: PropertyDescriptor) => {
    let authInfo: AuthorizeInfo = {};
    if (policies) {
      if (typeof policies === 'string') authInfo.policies = [policies];
      else {
        authInfo.policies = policies;
      }
    }

    if (roles) {
      if (typeof roles === 'string') authInfo.roles = [roles];
      else {
        authInfo.roles = roles;
      }
    }
    if (descriptor && descriptor.value) {
      SetAuthInfo(descriptor.value, authInfo);
    } else {
      SetAuthInfo(target, authInfo);
    }
  };
  return func;
}

// target: any, key: string, descriptor: PropertyDescriptor

export function GetAuthInfo(target: any): AuthorizeInfo {
  return GetMetadata(GetMetadataToken(), target);
}

function SetAuthInfo(target: any, routerInfo: AuthorizeInfo) {
  DefineMetadata(GetMetadataToken(), routerInfo, target);
}

function GetMetadataToken() {
  return `${METADATA_AUTHORIZE_INFO}`;
}
