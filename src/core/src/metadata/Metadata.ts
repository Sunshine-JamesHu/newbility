const Metadata = Reflect.metadata;
const DefineMetadata = Reflect.defineMetadata;
const GetMetadata = Reflect.getMetadata;
const GetMetadataKeys = Reflect.getMetadataKeys;

function GetMetadataKey(key: string) {
  return `Metadata:${key}`;
}

export { Metadata, DefineMetadata, GetMetadata, GetMetadataKey, GetMetadataKeys };
