/// <reference types="node" />
import { OssOptions } from './OssOptions';
export declare const OSS_PROVIDER_INJECT_TOKEN: string;
export interface IOssProvider {
    GetAsync(path: string): Promise<Buffer>;
    SaveAsync(data: Buffer, fileName: string, group?: string): Promise<string>;
    RemoveAsync(path: string): Promise<void>;
}
export declare abstract class OssProvider implements IOssProvider {
    protected readonly _defaultGroup: string;
    abstract GetAsync(path: string): Promise<Buffer>;
    abstract SaveAsync(data: Buffer, fileName: string, group?: string): Promise<string>;
    abstract RemoveAsync(path: string): Promise<void>;
    protected GetFileType(fileName: string): string | undefined;
}
export declare function GetProviderInjectToken(providerKey: string): string;
export declare function GetOssProvider(providerKey: string): unknown;
export declare function UseOssProvider(type: string, options?: OssOptions): void;
