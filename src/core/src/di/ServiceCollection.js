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
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitServiceCollection = exports.ServiceCollection = exports.SC_INJECT_TOKEN = void 0;
const Dependency_1 = require("./Dependency");
exports.SC_INJECT_TOKEN = (0, Dependency_1.GetInjectToken)('Sys:IServiceCollection');
let ServiceCollection = class ServiceCollection {
    constructor() {
        this._modules = new Set();
    }
    /**
     * 添加模块
     * @param module
     */
    Add(module) {
        if (!!(0, Dependency_1.GetInjectInfo)(module)) {
            this._modules.add(module);
        }
    }
    /**
     * 获取所有模块
     * @returns 所有注册的模块
     */
    GetServices() {
        return this._modules;
    }
};
ServiceCollection = __decorate([
    (0, Dependency_1.Singleton)(exports.SC_INJECT_TOKEN),
    __metadata("design:paramtypes", [])
], ServiceCollection);
exports.ServiceCollection = ServiceCollection;
function InitServiceCollection() {
    Dependency_1.Container.registerSingleton(exports.SC_INJECT_TOKEN, ServiceCollection);
}
exports.InitServiceCollection = InitServiceCollection;
//# sourceMappingURL=ServiceCollection.js.map