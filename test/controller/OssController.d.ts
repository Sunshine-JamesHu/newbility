/// <reference types="node" />
import { Controller } from '../../src/koa-core/src/controller/Controller';
import { IOssService } from '../../src/oss-core/src/OssService';
import { File } from 'formidable';
export default class OssController extends Controller {
    private readonly _ossService;
    constructor(_ossService: IOssService);
    GetFile(path: string): Promise<Buffer>;
    UploadFile(data: {
        group: string | undefined;
        data?: File;
    }): Promise<string>;
    DeleteFile(path: string): Promise<void>;
}
