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
const Request_1 = require("../../src/koa-core/src/router/Request");
const Controller_1 = require("../../src/koa-core/src/controller/Controller");
const RequestData_1 = require("../../src/koa-core/src/router/RequestData");
const Router_1 = require("../../src/koa-core/src/router/Router");
const Dependency_1 = require("../../src/core/src/di/Dependency");
const OssService_1 = require("../../src/oss-core/src/OssService");
const UserFriendlyError_1 = require("../../src/core/src/error/UserFriendlyError");
const StreamHelper_1 = require("../../src/core/src/util/StreamHelper");
const Guid_1 = require("../../src/core/src/util/Guid");
const fs_1 = __importDefault(require("fs"));
const mime_types_1 = require("mime-types");
let OssController = class OssController extends Controller_1.Controller {
    constructor(_ossService) {
        super();
        this._ossService = _ossService;
    }
    async GetFile(path) {
        const mimeType = (0, mime_types_1.lookup)(path) || 'application/octet-stream';
        this.Context.set('Content-Type', mimeType);
        this.Context.set('Content-Disposition', `filename=${path.substring(path.indexOf('/') + 1)}`);
        const res = await this._ossService.GetAsync(path);
        return res;
    }
    async UploadFile(data) {
        if (data && data.data) {
            const reader = fs_1.default.createReadStream(data.data.filepath);
            const buffer = await StreamHelper_1.StreamHelper.StreamToBuffer(reader);
            return await this._ossService.SaveAsync(buffer, data.data.originalFilename || Guid_1.Guid.Create(), data.group);
        }
        throw new UserFriendlyError_1.UserFriendlyError('请选择一个文件进行上传');
    }
    async DeleteFile(path) {
        await this._ossService.RemoveAsync(path);
    }
};
__decorate([
    (0, Request_1.HttpGet)(),
    __param(0, (0, RequestData_1.RequestQuery)('path')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OssController.prototype, "GetFile", null);
__decorate([
    (0, Request_1.HttpPost)(),
    __param(0, (0, RequestData_1.RequestBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OssController.prototype, "UploadFile", null);
__decorate([
    (0, Request_1.HttpDelete)(),
    __param(0, (0, RequestData_1.RequestQuery)('path')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OssController.prototype, "DeleteFile", null);
OssController = __decorate([
    (0, Dependency_1.Injectable)(),
    (0, Dependency_1.Transient)(),
    (0, Router_1.Router)({ desc: 'Oss存储测试' }),
    __param(0, (0, Dependency_1.Inject)(OssService_1.OSS_SVC_INJECT_TOKEN)),
    __metadata("design:paramtypes", [Object])
], OssController);
exports.default = OssController;
//# sourceMappingURL=OssController.js.map