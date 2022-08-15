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
exports.OssService = exports.OSS_SVC_INJECT_TOKEN = void 0;
const Dependency_1 = require("../../core/src/di/Dependency");
const OssProvider_1 = require("./OssProvider");
exports.OSS_SVC_INJECT_TOKEN = (0, Dependency_1.GetInjectToken)('Sys:IOssService');
let OssService = class OssService {
    constructor(ossProvider) {
        this._ossProvider = ossProvider;
    }
    GetAsync(path) {
        return this._ossProvider.GetAsync(path);
    }
    SaveAsync(data, fileName, group) {
        return this._ossProvider.SaveAsync(data, fileName, group);
    }
    RemoveAsync(path) {
        return this._ossProvider.RemoveAsync(path);
    }
};
OssService = __decorate([
    (0, Dependency_1.Injectable)(),
    (0, Dependency_1.Singleton)(exports.OSS_SVC_INJECT_TOKEN),
    __param(0, (0, Dependency_1.Inject)(OssProvider_1.OSS_PROVIDER_INJECT_TOKEN)),
    __metadata("design:paramtypes", [Object])
], OssService);
exports.OssService = OssService;
//# sourceMappingURL=OssService.js.map