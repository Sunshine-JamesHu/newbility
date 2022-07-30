import { GetInjectToken } from '../../core/src/di/Dependency';

export const OSS_PROVIDER_INJECT_TOKEN = GetInjectToken('Sys:IOssProvider');

export interface IOssProvider {
  GetAsync(path: string): Promise<Buffer>;
  SaveAsync(data: Buffer, fileName: string, group?: string): Promise<string>;
  RemoveAsync(path: string): Promise<void>;
}

export abstract class OssProvider implements IOssProvider {
  protected readonly _defaultGroup: string = 'files';

  abstract GetAsync(path: string): Promise<Buffer>;
  abstract SaveAsync(data: Buffer, fileName: string, group?: string): Promise<string>;
  abstract RemoveAsync(path: string): Promise<void>;

  protected GetFileType(fileName: string): string | undefined {
    const index = fileName.lastIndexOf('.');
    if (index === -1) return undefined;

    const f = fileName.substring(index);
    return f;
  }
}

export function GetProviderInjectToken(providerKey: string) {
  if (!providerKey) return OSS_PROVIDER_INJECT_TOKEN;
  return `${OSS_PROVIDER_INJECT_TOKEN}:${providerKey}`;
}
