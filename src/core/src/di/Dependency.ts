import { container, inject, injectable } from 'tsyringe';
import { DefineMetadata, GetMetadata, GetMetadataKey } from '../metadata/Metadata';

export enum ServiceLifetime {
  Singleton = 0,
  Transient = 2,
}

const INJECT_INFO_METADATA_TOKEN = GetMetadataKey('Sys:InjectInfo');
const MULTIPLE_INS_METADATA_TOKEN = GetMetadataKey('Sys:MultipleInstance');
const REPLACE_SERVICE_METADATA_TOKEN = GetMetadataKey('Sys:ReplaceService');
const ABSTRACT_METADATA_TOKEN = GetMetadataKey('Sys:Abstract');

export interface InjectInfo {
  token: string;
  lifetime: ServiceLifetime;
  replace?: boolean;
}

//#region  注入相关
export function Transient(token?: string) {
  return (target: Function) => {
    DefineMetadataInjectInfo(target, ServiceLifetime.Transient, token);
  };
}

export function Singleton(token?: string) {
  return (target: Function) => {
    DefineMetadataInjectInfo(target, ServiceLifetime.Singleton, token);
  };
}

function DefineMetadataInjectInfo(target: Function, lifetime: ServiceLifetime, token?: string) {
  if (!token) token = target.name;

  let injectInfo = GetInjectInfo(target);
  if (!injectInfo) injectInfo = {} as any;

  injectInfo.lifetime = lifetime;
  injectInfo.token = token;

  DefineMetadata(INJECT_INFO_METADATA_TOKEN, injectInfo, target);
}

export function GetInjectInfo(target: Function): InjectInfo {
  return GetMetadata(INJECT_INFO_METADATA_TOKEN, target);
}
//#endregion

//#region 替换服务
export function ReplaceService() {
  return (target: Function) => {
    DefineMetadata(REPLACE_SERVICE_METADATA_TOKEN, true, target);
  };
}

export function NeedReplaceService(target: Function): boolean {
  return !!GetMetadata(REPLACE_SERVICE_METADATA_TOKEN, target);
}
//#endregion

//#region 多实例注册

export function AllowMultiple() {
  return (target: Function) => {
    DefineMetadata(MULTIPLE_INS_METADATA_TOKEN, true, target);
  };
}

export function IsMultipleRegister(target: Function): boolean {
  return !!GetMetadata(MULTIPLE_INS_METADATA_TOKEN, target);
}
//#endregion

//#region 抽象类

export function Abstract() {
  return (target: Function) => {
    DefineMetadata(ABSTRACT_METADATA_TOKEN, target, target);
  };
}

export function IsAbstract(target: Function): boolean {
  const metadata = GetMetadata(ABSTRACT_METADATA_TOKEN, target);
  if (!metadata) return false;
  return target === metadata;
}

//#endregion

export const Injectable = injectable;

export const Inject = inject;

export const Container = container;

export function GetInjectToken(token: string) {
  return `InjectToken:${token}`;
}
