/// <reference types="node" />
import { IOssProvider } from './OssProvider';
export declare const OSS_SVC_INJECT_TOKEN: string;
export interface IOssService {
    GetAsync(path: string): Promise<Buffer>;
    SaveAsync(data: Buffer, fileName: string, group?: string): Promise<string>;
    RemoveAsync(path: string): Promise<void>;
}
export declare class OssService implements IOssService {
    private readonly _ossProvider;
    constructor(ossProvider: IOssProvider);
    GetAsync(path: string): Promise<Buffer>;
    SaveAsync(data: Buffer, fileName: string, group?: string | undefined): Promise<string>;
    RemoveAsync(path: string): Promise<void>;
}
