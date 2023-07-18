import { GetMetadataKey, GetMetadata, DefineMetadata } from '@newbility/core';

const METADATA_ALLOWANONYMOUS_INFO = GetMetadataKey('Sys:Auth:AllowAnonymous');

export function AllowAnonymous() {
  return (target: any, key: string, descriptor: PropertyDescriptor) => {
    DefineMetadata(METADATA_ALLOWANONYMOUS_INFO, true, descriptor.value);
  };
}

export function IsAllowAnonymous(target: Function): boolean {
  return !!GetMetadata(METADATA_ALLOWANONYMOUS_INFO, target);
}
