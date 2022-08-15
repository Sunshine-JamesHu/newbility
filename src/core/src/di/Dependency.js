"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetInjectToken = exports.Container = exports.Inject = exports.Injectable = exports.IsAbstract = exports.Abstract = exports.IsMultipleRegister = exports.AllowMultiple = exports.NeedReplaceService = exports.ReplaceService = exports.GetInjectInfo = exports.Singleton = exports.Transient = exports.ServiceLifetime = void 0;
const tsyringe_1 = require("tsyringe");
const Metadata_1 = require("../metadata/Metadata");
var ServiceLifetime;
(function (ServiceLifetime) {
    ServiceLifetime[ServiceLifetime["Singleton"] = 0] = "Singleton";
    ServiceLifetime[ServiceLifetime["Transient"] = 2] = "Transient";
})(ServiceLifetime = exports.ServiceLifetime || (exports.ServiceLifetime = {}));
const INJECT_INFO_METADATA_TOKEN = (0, Metadata_1.GetMetadataKey)('Sys:InjectInfo');
const MULTIPLE_INS_METADATA_TOKEN = (0, Metadata_1.GetMetadataKey)('Sys:MultipleInstance');
const REPLACE_SERVICE_METADATA_TOKEN = (0, Metadata_1.GetMetadataKey)('Sys:ReplaceService');
const ABSTRACT_METADATA_TOKEN = (0, Metadata_1.GetMetadataKey)('Sys:Abstract');
//#region  注入相关
function Transient(token) {
    return (target) => {
        DefineMetadataInjectInfo(target, ServiceLifetime.Transient, token);
    };
}
exports.Transient = Transient;
function Singleton(token) {
    return (target) => {
        DefineMetadataInjectInfo(target, ServiceLifetime.Singleton, token);
    };
}
exports.Singleton = Singleton;
function DefineMetadataInjectInfo(target, lifetime, token) {
    if (!token)
        token = target.name;
    let injectInfo = GetInjectInfo(target);
    if (!injectInfo)
        injectInfo = {};
    injectInfo.lifetime = lifetime;
    injectInfo.token = token;
    (0, Metadata_1.DefineMetadata)(INJECT_INFO_METADATA_TOKEN, injectInfo, target);
}
function GetInjectInfo(target) {
    return (0, Metadata_1.GetMetadata)(INJECT_INFO_METADATA_TOKEN, target);
}
exports.GetInjectInfo = GetInjectInfo;
//#endregion
//#region 替换服务
function ReplaceService() {
    return (target) => {
        (0, Metadata_1.DefineMetadata)(REPLACE_SERVICE_METADATA_TOKEN, true, target);
    };
}
exports.ReplaceService = ReplaceService;
function NeedReplaceService(target) {
    return !!(0, Metadata_1.GetMetadata)(REPLACE_SERVICE_METADATA_TOKEN, target);
}
exports.NeedReplaceService = NeedReplaceService;
//#endregion
//#region 多实例注册
function AllowMultiple() {
    return (target) => {
        (0, Metadata_1.DefineMetadata)(MULTIPLE_INS_METADATA_TOKEN, true, target);
    };
}
exports.AllowMultiple = AllowMultiple;
function IsMultipleRegister(target) {
    return !!(0, Metadata_1.GetMetadata)(MULTIPLE_INS_METADATA_TOKEN, target);
}
exports.IsMultipleRegister = IsMultipleRegister;
//#endregion
//#region 抽象类
function Abstract() {
    return (target) => {
        (0, Metadata_1.DefineMetadata)(ABSTRACT_METADATA_TOKEN, target, target);
    };
}
exports.Abstract = Abstract;
function IsAbstract(target) {
    const metadata = (0, Metadata_1.GetMetadata)(ABSTRACT_METADATA_TOKEN, target);
    if (!metadata)
        return false;
    return target === metadata;
}
exports.IsAbstract = IsAbstract;
//#endregion
exports.Injectable = tsyringe_1.injectable;
exports.Inject = tsyringe_1.inject;
exports.Container = tsyringe_1.container;
function GetInjectToken(token) {
    return `InjectToken:${token}`;
}
exports.GetInjectToken = GetInjectToken;
//# sourceMappingURL=Dependency.js.map