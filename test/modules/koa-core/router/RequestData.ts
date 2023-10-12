import { GetMetadataKey, GetMetadata, DefineMetadata } from '@newbility/core';

export const METADATA_ACTION_PARAMS = GetMetadataKey('Sys:ActionParams');

export enum RequestParamType {
  Body = 0,
  Param = 1,
}

interface ActionParams {
  in: 'body' | 'query';
  key?: string;
  index: number;
  type: any;
}

export function RequestQuery(paramName?: string) {
  return (target: any, key: string, index: number) => {
    const paramTypes = GetMetadata('design:paramtypes', target, key);
    const params = GetActionParamsMetadata(target[key]);
    params.unshift({ in: 'query', key: paramName, index: index, type: paramTypes[index] });
    DefineMetadata(METADATA_ACTION_PARAMS, params, target[key]);
  };
}

export function RequestBody() {
  return (target: any, key: string, index: number) => {
    const paramTypes = GetMetadata('design:paramtypes', target, key);
    const params = GetActionParamsMetadata(target[key]);
    params.push({ in: 'body', index: index, type: paramTypes[index] });
    DefineMetadata(METADATA_ACTION_PARAMS, params, target[key]);
  };
}

export function GetActionParamsMetadata(target: any): Array<ActionParams> {
  return GetMetadata(METADATA_ACTION_PARAMS, target) || [];
}
