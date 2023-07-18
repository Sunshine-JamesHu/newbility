import { GetMetadataKey, DefineMetadata, GetMetadata } from '@newbility/core';

export enum HttpMethod {
  GET = 0,
  POST = 1,
  PUT = 2,
  DELETE = 3,
  OPTIONS = 4,
}

const METADATA_ACTION_INFO = GetMetadataKey('Sys:ActionInfo');

export interface ActionInfo {
  name?: string;
  desc?: string;
}

export interface FullActionInfo extends ActionInfo {
  httpMethod: HttpMethod;
  name: string;
}

export function HttpGet(data?: string | ActionInfo) {
  return HttpRequest(HttpMethod.GET, data);
}

export function HttpPost(data?: string | ActionInfo) {
  return HttpRequest(HttpMethod.POST, data);
}

export function HttpPut(data?: string | ActionInfo) {
  return HttpRequest(HttpMethod.PUT, data);
}

export function HttpDelete(data?: string | ActionInfo) {
  return HttpRequest(HttpMethod.DELETE, data);
}

export function HttpOptions(data?: string | ActionInfo) {
  return HttpRequest(HttpMethod.OPTIONS, data);
}

export function HttpRequest(httpMethod: HttpMethod, data?: string | ActionInfo) {
  return (target: any, key: string, descriptor: PropertyDescriptor) => {
    let actionName = key;
    let desc: string | undefined = undefined;
    if (data) {
      if (typeof data === 'string') actionName = data;
      else {
        if (data.name) actionName = data.name;
        if (data.desc) desc = data.desc;
      }
    }

    if (!data) data = key;
    const actionInfo: FullActionInfo = {
      name: GetActionName(actionName),
      httpMethod: httpMethod,
      desc: desc,
    };
    SetActionInfo(descriptor.value, actionInfo);
  };
}

export function GetHttpMethodStr(httpMethod: HttpMethod): string {
  let methodStr = 'get';
  switch (httpMethod) {
    case HttpMethod.POST:
      methodStr = 'post';
      break;
    case HttpMethod.PUT:
      methodStr = 'put';
      break;
    case HttpMethod.DELETE:
      methodStr = 'delete';
      break;
    case HttpMethod.OPTIONS:
      methodStr = 'options';
      break;
    default:
      methodStr = 'get';
      break;
  }
  return methodStr;
}

export function GetActionInfo(action: Function): FullActionInfo {
  return GetMetadata(METADATA_ACTION_INFO, action);
}

function GetActionName(actionName: string): string {
  actionName = `${actionName[0].toLowerCase()}${actionName.substring(1, actionName.length)}`;
  return actionName;
}

function SetActionInfo(target: Object, actionInfo: FullActionInfo) {
  DefineMetadata(METADATA_ACTION_INFO, actionInfo, target);
}
