/// <reference types="node" />
import { OssProvider } from '../../oss-core/src/OssProvider';
import { MinioOptions } from './MinioOptions';
interface MinioFileInfo {
    fileName: string;
    bucketName: string;
}
export declare class MinioProvider extends OssProvider {
    private readonly _options;
    private readonly _client;
    constructor(options: MinioOptions);
    GetAsync(path: string): Promise<Buffer>;
    SaveAsync(data: Buffer, fileName: string, group?: string | undefined): Promise<string>;
    RemoveAsync(path: string): Promise<void>;
    protected CreateBucketAsync(name: string): Promise<void>;
    protected NewFileName(fileName: string): string;
    protected FullTag(fileName: string, bucketName?: string): string;
    protected GetBucketNameAndFileName(path: string): MinioFileInfo;
}
export {};
