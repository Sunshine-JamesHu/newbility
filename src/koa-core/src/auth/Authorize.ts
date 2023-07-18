import { GetMetadataKey, GetMetadata, DefineMetadata } from '@newbility/core';

const METADATA_AUTHORIZE_INFO = GetMetadataKey('Sys:Auth:AuthorizeInfo');

export interface AuthorizeInfo {
  policies?: string[];
  roles?: string[];
}

export function Authorize(authInfo?: AuthorizeInfo) {
  const func: any = (target: any, key?: string, descriptor?: PropertyDescriptor) => {
    if (!authInfo) authInfo = {};
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

export function SetAuthInfo(target: any, routerInfo: AuthorizeInfo) {
  DefineMetadata(GetMetadataToken(), routerInfo, target);
}

function GetMetadataToken() {
  return `${METADATA_AUTHORIZE_INFO}`;
}
