"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigureOssOptions = exports.GetOssOptionsInjectToken = exports.OSS_OPTIONS_INJECT_TOKEN = void 0;
const Dependency_1 = require("../../core/src/di/Dependency");
const SettingManager_1 = require("../../core/src/setting/SettingManager");
exports.OSS_OPTIONS_INJECT_TOKEN = (0, Dependency_1.GetInjectToken)('Sys:OssOptions');
function GetOssOptionsInjectToken(key) {
    if (!key)
        return exports.OSS_OPTIONS_INJECT_TOKEN;
    return `${exports.OSS_OPTIONS_INJECT_TOKEN}:${key}`;
}
exports.GetOssOptionsInjectToken = GetOssOptionsInjectToken;
function ConfigureOssOptions(type, options) {
    if (!options) {
        const settingManager = Dependency_1.Container.resolve(SettingManager_1.SETTING_INJECT_TOKEN);
        options = settingManager.GetConfig(`oss:${type}`);
    }
    Dependency_1.Container.register(GetOssOptionsInjectToken(type), { useValue: options });
}
exports.ConfigureOssOptions = ConfigureOssOptions;
//# sourceMappingURL=OssOptions.js.map