"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterModule = exports.RegisterModuleByPath = exports.GetModuleDepends = exports.StopModule = exports.StartModule = exports.GetModulePath = exports.ModulePath = exports.MODULE_PATH_METADATA_TOKEN = exports.AppModule = exports.MODULE_INJECT_TOKEN = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const Dependency_1 = require("../di/Dependency");
const DependsOn_1 = require("./DependsOn");
const Logger_1 = require("../logger/Logger");
const Metadata_1 = require("../metadata/Metadata");
const ServiceCollection_1 = require("../di/ServiceCollection");
const ServiceLoader_1 = require("../di/ServiceLoader");
exports.MODULE_INJECT_TOKEN = (0, Dependency_1.GetInjectToken)('Sys:IModule');
let AppModule = class AppModule {
    OnPreApplicationInitialization() { }
    OnApplicationInitialization() { }
    OnPostApplicationInitialization() { }
    OnApplicationShutdown() { }
};
AppModule = __decorate([
    (0, Dependency_1.Singleton)(exports.MODULE_INJECT_TOKEN),
    (0, Dependency_1.AllowMultiple)(),
    (0, Dependency_1.Abstract)()
], AppModule);
exports.AppModule = AppModule;
exports.MODULE_PATH_METADATA_TOKEN = (0, Metadata_1.GetMetadataKey)('Sys:ModulePath');
function ModulePath(modulePath) {
    return (target) => {
        (0, Metadata_1.DefineMetadata)(exports.MODULE_PATH_METADATA_TOKEN, modulePath, target);
    };
}
exports.ModulePath = ModulePath;
function GetModulePath(target) {
    return (0, Metadata_1.GetMetadata)(exports.MODULE_PATH_METADATA_TOKEN, target);
}
exports.GetModulePath = GetModulePath;
/**
 * 启动模块
 * @param moduleType 模块类型
 */
async function StartModule(moduleType) {
    const logger = Dependency_1.Container.resolve(Logger_1.LOGGER_INJECT_TOKEN);
    const services = Dependency_1.Container.resolve(ServiceCollection_1.SC_INJECT_TOKEN);
    const serviceLoader = Dependency_1.Container.resolve(ServiceLoader_1.SVC_LOADER_INJECT_TOKEN);
    const allModule = GetModuleDepends(moduleType);
    allModule.forEach((module) => {
        const modulePath = GetModulePath(module);
        if (modulePath) {
            logger.LogDebug(`Start Module -> ${module.name}`);
            RegisterModuleByPath(modulePath, services);
        }
    });
    // 注册所有Service
    serviceLoader.RegisterServices();
    const allModuleArr = Dependency_1.Container.resolveAll(exports.MODULE_INJECT_TOKEN);
    // 预处理
    for (let index = 0; index < allModuleArr.length; index++) {
        const module = allModuleArr[index];
        const task = module.OnPreApplicationInitialization();
        if (task instanceof Promise) {
            await task;
        }
    }
    // 初始化
    for (let index = 0; index < allModuleArr.length; index++) {
        const module = allModuleArr[index];
        const task = module.OnApplicationInitialization();
        if (task instanceof Promise) {
            await task;
        }
    }
    // 初始化完成之后
    for (let index = 0; index < allModuleArr.length; index++) {
        const module = allModuleArr[index];
        const task = module.OnPostApplicationInitialization();
        if (task instanceof Promise) {
            await task;
        }
    }
}
exports.StartModule = StartModule;
/**
 * 停止模块
 * @param moduleType 模块类型
 */
async function StopModule(moduleType) {
    const logger = Dependency_1.Container.resolve(Logger_1.LOGGER_INJECT_TOKEN);
    const allModule = GetModuleDepends(moduleType);
    const allModuleArr = [];
    allModule.forEach((element) => {
        const module = Dependency_1.Container.resolve(element);
        allModuleArr.push(module);
        logger.LogDebug(`Stop Module -> ${element.name}`);
    });
    for (let index = 0; index < allModuleArr.length; index++) {
        const module = allModuleArr[index];
        const task = module.OnApplicationShutdown();
        if (task instanceof Promise) {
            await task;
        }
    }
}
exports.StopModule = StopModule;
function GetModuleDepends(moduleType) {
    const moduleDepends = new Set();
    const dependModules = (0, DependsOn_1.GetDependModules)(moduleType);
    if (dependModules && dependModules.length > 0) {
        dependModules.forEach((dependModule) => {
            const tmpSet = GetModuleDepends(dependModule);
            if (tmpSet.size > 0) {
                tmpSet.forEach((t) => {
                    moduleDepends.add(t);
                });
            }
        });
    }
    moduleDepends.add(moduleType);
    return moduleDepends;
}
exports.GetModuleDepends = GetModuleDepends;
function RegisterModuleByPath(modulePath, services) {
    let files = [];
    try {
        files = fs_1.default.readdirSync(modulePath);
    }
    catch (error) {
        console.error('Module路径配置错误,请检查配置后重试.');
        files = [];
    }
    files.forEach((filePath) => {
        const fullFilePath = path_1.default.join(modulePath, filePath);
        if (fs_1.default.statSync(fullFilePath).isDirectory()) {
            RegisterModuleByPath(fullFilePath, services);
        }
        else {
            const extName = path_1.default.extname(fullFilePath);
            if (fullFilePath.endsWith('.d.ts'))
                return; // 单独去掉.d.ts这个描述文件
            if (extName === '.ts' || extName === '.js') {
                const modules = require(fullFilePath);
                if (!modules)
                    return;
                for (const key in modules) {
                    if (Object.prototype.hasOwnProperty.call(modules, key)) {
                        const module = modules[key];
                        if (module.prototype) {
                            RegisterModule(module, services);
                        }
                    }
                }
            }
        }
    });
}
exports.RegisterModuleByPath = RegisterModuleByPath;
function RegisterModule(module, services) {
    const injectInfo = (0, Dependency_1.GetInjectInfo)(module);
    if (!injectInfo)
        return; // 没有注册信息的不进行注册
    const isAbstract = (0, Dependency_1.IsAbstract)(module);
    if (isAbstract)
        return; // 抽象类不进行注册
    services.Add(module);
}
exports.RegisterModule = RegisterModule;
//# sourceMappingURL=AppModule.js.map