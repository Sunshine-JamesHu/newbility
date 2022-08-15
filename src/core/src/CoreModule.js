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
exports.CoreModule = void 0;
const Dependency_1 = require("./di/Dependency");
const ServiceCollection_1 = require("./di/ServiceCollection");
const EventBus_1 = require("./event/EventBus");
const EventHandler_1 = require("./event/EventHandler");
const AppModule_1 = require("./modularity/AppModule");
let CoreModule = class CoreModule extends AppModule_1.AppModule {
    constructor(services, eventBus) {
        super();
        this._services = services;
        this._eventBus = eventBus;
    }
    OnPreApplicationInitialization() {
        this.InitEventHandlers();
    }
    InitEventHandlers() {
        const svcs = this._services.GetServices();
        svcs.forEach((svc) => {
            const eventKey = (0, EventHandler_1.GetEventKey)(svc);
            if (eventKey) {
                this._eventBus.Subscribe(eventKey, svc);
            }
        });
    }
};
CoreModule = __decorate([
    (0, AppModule_1.ModulePath)(__dirname),
    (0, Dependency_1.Injectable)(),
    __param(0, (0, Dependency_1.Inject)(ServiceCollection_1.SC_INJECT_TOKEN)),
    __param(1, (0, Dependency_1.Inject)(EventBus_1.EVENT_BUS_INJECT_TOKEN)),
    __metadata("design:paramtypes", [Object, Object])
], CoreModule);
exports.CoreModule = CoreModule;
//# sourceMappingURL=CoreModule.js.map