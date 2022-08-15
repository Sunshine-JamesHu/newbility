"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UseOssProvider = exports.GetOssProvider = exports.GetProviderInjectToken = exports.OssProvider = exports.OSS_PROVIDER_INJECT_TOKEN = void 0;
const Dependency_1 = require("../../core/src/di/Dependency");
const OssOptions_1 = require("./OssOptions");
exports.OSS_PROVIDER_INJECT_TOKEN = (0, Dependency_1.GetInjectToken)('Sys:IOssProvider');
class OssProvider {
    constructor() {
        this._defaultGroup = 'files';
    }
    GetFileType(fileName) {
        const index = fileName.lastIndexOf('.');
        if (index === -1)
            return undefined;
        const f = fileName.substring(index);
        return f;
    }
}
exports.OssProvider = OssProvider;
function GetProviderInjectToken(providerKey) {
    if (!providerKey)
        return exports.OSS_PROVIDER_INJECT_TOKEN;
    return `${exports.OSS_PROVIDER_INJECT_TOKEN}:${providerKey}`;
}
exports.GetProviderInjectToken = GetProviderInjectToken;
function GetOssProvider(providerKey) {
    return Dependency_1.Container.resolve(GetProviderInjectToken(providerKey));
}
exports.GetOssProvider = GetOssProvider;
function UseOssProvider(type, options) {
    (0, OssOptions_1.ConfigureOssOptions)(type, options);
    Dependency_1.Container.register(exports.OSS_PROVIDER_INJECT_TOKEN, {
        useFactory: () => {
            return GetOssProvider(type);
        },
    });
}
exports.UseOssProvider = UseOssProvider;
//# sourceMappingURL=OssProvider.js.map