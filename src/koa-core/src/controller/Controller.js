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
exports.GetAllControllers = exports.GetControllerName = exports.IsController = exports.Controller = exports.CONTROLLER_INJECT_TOKEN = exports.CONTROLLER_METADATA = void 0;
const core_1 = require("@newbility/core");
exports.CONTROLLER_METADATA = (0, core_1.GetMetadataKey)('Sys:Controller');
exports.CONTROLLER_INJECT_TOKEN = (0, core_1.GetInjectToken)('Sys:Controller');
let Controller = class Controller {
    constructor() {
        this._logger = core_1.Container.resolve(core_1.LOGGER_INJECT_TOKEN);
    }
    // 系统会调用该函数
    SetContext(ctx) {
        this._context = ctx;
    }
    get Context() {
        return this._context;
    }
    get Logger() {
        return this._logger;
    }
};
Controller = __decorate([
    (0, core_1.Metadata)(exports.CONTROLLER_METADATA, true),
    (0, core_1.Abstract)(),
    __metadata("design:paramtypes", [])
], Controller);
exports.Controller = Controller;
function IsController(target) {
    return (0, core_1.GetMetadata)(exports.CONTROLLER_METADATA, target);
}
exports.IsController = IsController;
function GetControllerName(controller) {
    return controller.name.replace('Controller', '');
}
exports.GetControllerName = GetControllerName;
function GetAllControllers() {
    const sc = core_1.Container.resolve(core_1.SC_INJECT_TOKEN);
    const services = sc.GetServices();
    const controllers = [];
    services.forEach((element) => {
        if (IsController(element))
            controllers.push(element);
    });
    return controllers;
}
exports.GetAllControllers = GetAllControllers;
//# sourceMappingURL=Controller.js.map