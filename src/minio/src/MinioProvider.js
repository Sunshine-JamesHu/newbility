"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MinioProvider = void 0;
const minio_1 = require("minio");
const Dependency_1 = require("../../core/src/di/Dependency");
const OssProvider_1 = require("../../oss-core/src/OssProvider");
const OssOptions_1 = require("../../oss-core/src/OssOptions");
const StreamHelper_1 = require("../../core/src/util/StreamHelper");
const NewbilityError_1 = require("../../core/src/error/NewbilityError");
const Guid_1 = require("../../core/src/util/Guid");
const MinioConst_1 = require("./MinioConst");
let MinioProvider = class MinioProvider extends OssProvider_1.OssProvider {
    constructor(options) {
        super();
        this._options = options;
        this._client = GetClient(options);
    }
    async GetAsync(path) {
        const fileInfo = this.GetBucketNameAndFileName(path);
        const data = await this._client.getObject(fileInfo.bucketName, fileInfo.fileName);
        return StreamHelper_1.StreamHelper.StreamToBuffer(data);
    }
    async SaveAsync(data, fileName, group) {
        const bucketName = group || this._defaultGroup;
        await this.CreateBucketAsync(bucketName);
        const newFileName = this.NewFileName(fileName);
        try {
            await this._client.putObject(bucketName, newFileName, data);
            return this.FullTag(newFileName, bucketName);
        }
        catch (error) {
            throw new NewbilityError_1.NewbilityError('文件上传Minio失败', error);
        }
    }
    async RemoveAsync(path) {
        const fileInfo = this.GetBucketNameAndFileName(path);
        await this._client.removeObject(fileInfo.bucketName, fileInfo.fileName);
    }
    async CreateBucketAsync(name) {
        const buckets = await this._client.listBuckets();
        if (buckets && buckets.length) {
            const bucket = buckets.find((p) => p.name === name);
            if (bucket)
                return;
        }
        await this._client.makeBucket(name, 'cn-north-1');
    }
    NewFileName(fileName) {
        const f = this.GetFileType(fileName);
        return `${Guid_1.Guid.Create()}${f}`;
    }
    FullTag(fileName, bucketName) {
        return `${bucketName || this._defaultGroup}/${fileName}`;
    }
    GetBucketNameAndFileName(path) {
        const index = path.indexOf('/');
        if (index < 0) {
            return {
                fileName: path,
                bucketName: this._defaultGroup,
            };
        }
        else {
            const group = path.substring(0, index) || this._defaultGroup;
            const fileName = path.substring(index);
            return {
                fileName: fileName,
                bucketName: group,
            };
        }
    }
};
MinioProvider = __decorate([
    (0, Dependency_1.Injectable)(),
    (0, Dependency_1.Singleton)((0, OssProvider_1.GetProviderInjectToken)(MinioConst_1.OSS_KEY)),
    __param(0, (0, Dependency_1.Inject)((0, OssOptions_1.GetOssOptionsInjectToken)(MinioConst_1.OSS_KEY))),
    __metadata("design:paramtypes", [Object])
], MinioProvider);
exports.MinioProvider = MinioProvider;
function GetClient(options) {
    if (!options)
        throw new NewbilityError_1.NewbilityError('缺少Minio配置,请初始化Minio配置');
    const client = new minio_1.Client({
        endPoint: options.addr,
        port: options.port,
        accessKey: options.userName,
        secretKey: options.password,
        useSSL: options.useSSL,
    });
    return client;
}
//# sourceMappingURL=MinioProvider.js.map