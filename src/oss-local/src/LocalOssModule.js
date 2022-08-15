"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalOssModule = void 0;
const AppModule_1 = require("../../core/src/modularity/AppModule");
const Dependency_1 = require("../../core/src/di/Dependency");
const DependsOn_1 = require("../../core/src/modularity/DependsOn");
const OssOptions_1 = require("../../oss-core/src/OssOptions");
const OssCoreModule_1 = require("../../oss-core/src/OssCoreModule");
const LocalOssConst_1 = require("./LocalOssConst");
let LocalOssModule = class LocalOssModule extends AppModule_1.AppModule {
    OnPreApplicationInitialization() {
        (0, OssOptions_1.ConfigureOssOptions)(LocalOssConst_1.OSS_KEY);
    }
};
LocalOssModule = __decorate([
    (0, AppModule_1.ModulePath)(__dirname),
    (0, Dependency_1.Injectable)(),
    (0, DependsOn_1.DependsOn)(OssCoreModule_1.OssCoreModule)
], LocalOssModule);
exports.LocalOssModule = LocalOssModule;
//# sourceMappingURL=LocalOssModule.js.map