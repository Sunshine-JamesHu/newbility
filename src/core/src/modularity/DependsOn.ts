import { DefineMetadata, GetMetadata, GetMetadataKey } from '../metadata/Metadata';

const METADATA_TOKEN = GetMetadataKey('Sys:DependsOn');

export function DependsOn(...module: any[]) {
  return (target: Function) => {
    DefineMetadata(METADATA_TOKEN, module, target);
  };
}

export function GetDependModules(target: any): any[] {
  return GetMetadata(METADATA_TOKEN, target);
}
