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
exports.InitServiceLoader = exports.ServiceLoader = exports.SVC_LOADER_INJECT_TOKEN = void 0;
const Dependency_1 = require("./Dependency");
const ServiceCollection_1 = require("./ServiceCollection");
exports.SVC_LOADER_INJECT_TOKEN = (0, Dependency_1.GetInjectToken)('Sys:IServiceLoader');
let ServiceLoader = class ServiceLoader {
    constructor(services) {
        this._services = services;
    }
    get Services() {
        return this._services;
    }
    RegisterServices() {
        const services = this._services.GetServices();
        services.forEach((service) => {
            const injectInfo = (0, Dependency_1.GetInjectInfo)(service);
            if (!injectInfo)
                return; // 没有注册信息的不进行注册
            const isAbstract = (0, Dependency_1.IsAbstract)(service);
            if (isAbstract)
                return; // 抽象类不进行注册
            const isRegistered = Dependency_1.Container.isRegistered(injectInfo.token);
            const isMultipleRegister = (0, Dependency_1.IsMultipleRegister)(service);
            if (isRegistered && !isMultipleRegister)
                return;
            const lifetime = injectInfo.lifetime;
            if (lifetime == Dependency_1.ServiceLifetime.Singleton) {
                Dependency_1.Container.registerSingleton(injectInfo.token, service);
            }
            else if (lifetime == Dependency_1.ServiceLifetime.Transient) {
                Dependency_1.Container.register(injectInfo.token, {
                    useClass: service,
                });
            }
        });
    }
};
ServiceLoader = __decorate([
    (0, Dependency_1.Singleton)(exports.SVC_LOADER_INJECT_TOKEN),
    (0, Dependency_1.Injectable)(),
    __param(0, (0, Dependency_1.Inject)(ServiceCollection_1.SC_INJECT_TOKEN)),
    __metadata("design:paramtypes", [Object])
], ServiceLoader);
exports.ServiceLoader = ServiceLoader;
function InitServiceLoader() {
    Dependency_1.Container.registerSingleton(exports.SVC_LOADER_INJECT_TOKEN, ServiceLoader);
}
exports.InitServiceLoader = InitServiceLoader;
//# sourceMappingURL=ServiceLoader.js.map