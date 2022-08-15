/// <reference types="node" />
import { OssProvider } from '../../oss-core/src/OssProvider';
import { LocalOssOptions } from './LocalOssOptions';
export declare class LocalOssProvider extends OssProvider {
    private readonly _options;
    constructor(options: LocalOssOptions);
    GetAsync(path: string): Promise<Buffer>;
    SaveAsync(data: Buffer, fileName: string, group?: string): Promise<string>;
    RemoveAsync(path: string): Promise<void>;
    protected GetFullDir(group?: string | undefined): string;
    protected GetTimeDirName(): string;
    protected GenFileName(fileName: string): string;
    private MkdirSync;
    private WriteFileAsync;
    private RemoveFileAsync;
}
