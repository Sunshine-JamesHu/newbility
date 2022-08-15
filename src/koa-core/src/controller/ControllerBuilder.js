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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ControllerBuilder = exports.CTL_BUILDER_INJECT_TOKEN = void 0;
const koa_router_1 = __importDefault(require("koa-router"));
const koa_1 = __importDefault(require("koa"));
const core_1 = require("@newbility/core");
const Controller_1 = require("./Controller");
const RequestData_1 = require("../router/RequestData");
const Router_1 = require("../router/Router");
const Request_1 = require("../router/Request");
exports.CTL_BUILDER_INJECT_TOKEN = (0, core_1.GetInjectToken)('Sys:IControllerBuilder');
let ControllerBuilder = class ControllerBuilder {
    constructor(settingManager, logger, app) {
        this._settingManager = settingManager;
        this._logger = logger;
        this._apiPrefix = settingManager.GetConfig('apiPrefix') || 'api';
        this._app = app;
    }
    CreateControllers() {
        const controllers = (0, Controller_1.GetAllControllers)();
        if (controllers && controllers.length) {
            const router = new koa_router_1.default(); // 定义路由容器
            controllers.forEach((controller) => {
                const actions = this.GetControllerActionDescriptors(controller);
                if (actions && actions.length) {
                    actions.forEach((action) => {
                        this._logger.LogDebug(`Action:${action.fullPath}`);
                        router.register(action.fullPath, [action.httpMethod], action.func);
                    });
                }
            });
            this._app.use(router.routes());
            this._app.use(router.allowedMethods());
        }
    }
    GetControllerActionDescriptors(controller) {
        const routerPath = (0, Router_1.GetRouterPath)(controller);
        if (!(0, Controller_1.IsController)(controller) || !routerPath) {
            return;
        }
        const actions = [];
        this._logger.LogDebug(`Create Controller: ${controller.name} -> ${routerPath}`);
        const propKeys = Object.getOwnPropertyNames(controller.prototype);
        propKeys.forEach((propKey) => {
            if (propKey === 'constructor')
                return; // 跳过构造函数
            const property = controller.prototype[propKey];
            if (!property || typeof property !== 'function')
                return;
            const actionInfo = (0, Request_1.GetActionInfo)(property);
            if (!actionInfo)
                return;
            const actionName = actionInfo.name;
            const fullPath = `/${this._apiPrefix}/${routerPath}/${actionName}`.replace(/\/{2,}/g, '/');
            const mainFunc = async (ctx, next) => {
                const actionParams = (0, RequestData_1.GetActionParamsMetadata)(property);
                const args = [];
                if (actionParams && actionParams.length) {
                    actionParams.forEach((element) => {
                        let data = null;
                        if (element.in === 'body') {
                            data = ctx.request.body;
                            // 处理FormData中带files的场景
                            if (ctx.request.files) {
                                if (!data)
                                    data = {};
                                for (const key in ctx.request.files) {
                                    if (Object.prototype.hasOwnProperty.call(ctx.request.files, key)) {
                                        const element = ctx.request.files[key];
                                        data[key] = element;
                                    }
                                }
                            }
                        }
                        else if (element.in === 'query') {
                            const queryData = { ...ctx.params, ...ctx.query };
                            data = queryData;
                            if (element.key) {
                                data = queryData[element.key];
                                // 单独处理Array
                                if (element.type.name.toLowerCase() === 'array' && !Array.isArray(data)) {
                                    data = [data];
                                }
                            }
                        }
                        if (data != null)
                            args[element.index] = data;
                    });
                }
                const controllerIns = core_1.Container.resolve(controller);
                controllerIns.SetContext(ctx); // 将Ctx丢进去
                const result = property.apply(controllerIns, args); // 执行函数
                if (result instanceof Promise) {
                    ctx.response.body = await result; // 处理异步
                }
                else {
                    ctx.response.body = result; // 处理同步
                }
            };
            const action = {
                fullPath,
                httpMethod: (0, Request_1.GetHttpMethodStr)(actionInfo.httpMethod),
                func: mainFunc,
            };
            actions.push(action);
        });
        return actions;
    }
};
ControllerBuilder = __decorate([
    (0, core_1.Injectable)(),
    (0, core_1.Singleton)(exports.CTL_BUILDER_INJECT_TOKEN),
    __param(0, (0, core_1.Inject)(core_1.SETTING_INJECT_TOKEN)),
    __param(1, (0, core_1.Inject)(core_1.LOGGER_INJECT_TOKEN)),
    __param(2, (0, core_1.Inject)((0, core_1.GetInjectToken)('Sys:App'))),
    __metadata("design:paramtypes", [Object, Object, koa_1.default])
], ControllerBuilder);
exports.ControllerBuilder = ControllerBuilder;
//# sourceMappingURL=ControllerBuilder.js.map