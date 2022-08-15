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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalOssProvider = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const moment_1 = __importDefault(require("moment"));
const Dependency_1 = require("../../core/src/di/Dependency");
const OssProvider_1 = require("../../oss-core/src/OssProvider");
const OssOptions_1 = require("../../oss-core/src/OssOptions");
const Guid_1 = require("../../core/src/util/Guid");
const StreamHelper_1 = require("../../core/src/util/StreamHelper");
const NewbilityError_1 = require("../../core/src/error/NewbilityError");
const LocalOssConst_1 = require("./LocalOssConst");
let LocalOssProvider = class LocalOssProvider extends OssProvider_1.OssProvider {
    constructor(options) {
        super();
        this._options = options;
    }
    async GetAsync(path) {
        if (!fs_1.default.existsSync(path)) {
            throw new NewbilityError_1.NewbilityError(`File not find. filePath->${path}`);
        }
        const reader = fs_1.default.createReadStream(path);
        const buffer = await StreamHelper_1.StreamHelper.StreamToBuffer(reader);
        return buffer;
    }
    async SaveAsync(data, fileName, group) {
        const dir = this.GetFullDir(group);
        const newFileName = this.GenFileName(fileName);
        const fullFileName = `${dir}/${newFileName}`;
        if (this.MkdirSync(dir)) {
            await this.WriteFileAsync(fullFileName, data);
        }
        return fullFileName;
    }
    async RemoveAsync(path) {
        await this.RemoveFileAsync(path);
    }
    GetFullDir(group) {
        const dirPath = [];
        // 根目录
        if (this._options.dir) {
            dirPath.push(this._options.dir);
        }
        // 桶目录
        const bucketName = group || this._defaultGroup;
        dirPath.push(bucketName);
        // 时间目录
        dirPath.push(this.GetTimeDirName());
        return dirPath.join('/');
    }
    GetTimeDirName() {
        return (0, moment_1.default)().format('YYYY/MM/DD');
    }
    GenFileName(fileName) {
        const f = this.GetFileType(fileName);
        let newFileName = Guid_1.Guid.Create();
        if (f)
            newFileName = `${newFileName}${f}`;
        return newFileName;
    }
    MkdirSync(dirname) {
        if (fs_1.default.existsSync(dirname)) {
            return true;
        }
        else {
            if (this.MkdirSync(path_1.default.dirname(dirname))) {
                fs_1.default.mkdirSync(dirname);
                return true;
            }
        }
        return false;
    }
    WriteFileAsync(path, data) {
        return new Promise((resovle, reject) => {
            fs_1.default.writeFile(path, data, (err) => {
                if (err)
                    reject(err);
                else
                    resovle(true);
            });
        });
    }
    RemoveFileAsync(path) {
        return new Promise((resovle, reject) => {
            fs_1.default.rm(path, (err) => {
                if (err)
                    reject(err);
                else
                    resovle(true);
            });
        });
    }
};
LocalOssProvider = __decorate([
    (0, Dependency_1.Injectable)(),
    (0, Dependency_1.Singleton)((0, OssProvider_1.GetProviderInjectToken)(LocalOssConst_1.OSS_KEY)),
    __param(0, (0, Dependency_1.Inject)((0, OssOptions_1.GetOssOptionsInjectToken)(LocalOssConst_1.OSS_KEY))),
    __metadata("design:paramtypes", [Object])
], LocalOssProvider);
exports.LocalOssProvider = LocalOssProvider;
//# sourceMappingURL=LocalOssProvider.js.map