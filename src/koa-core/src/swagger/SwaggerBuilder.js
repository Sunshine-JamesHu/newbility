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
exports.SwaggerBuilder = exports.SWAGGER_BUILDER_INJECT_TOKEN = void 0;
const koa_router_1 = __importDefault(require("koa-router"));
const koa_static_1 = __importDefault(require("koa-static"));
const path_1 = require("path");
const core_1 = require("@newbility/core");
const index_1 = require("./koa2-swagger-ui/index");
const Controller_1 = require("../controller/Controller");
const Request_1 = require("../router/Request");
const RequestData_1 = require("../router/RequestData");
const Router_1 = require("../router/Router");
const Controller_2 = require("../controller/Controller");
exports.SWAGGER_BUILDER_INJECT_TOKEN = 'ISwaggerBuilder';
class SwaggerPath {
    constructor(tag, parameters, responses) {
        this.tags = [tag];
        this.produces = ['application/json'];
        if (parameters && parameters.length > 0)
            this.parameters = parameters;
        else
            this.parameters = [];
        if (responses) {
            this.responses = responses;
        }
        else {
            this.responses = {
                200: {
                    description: '返回值',
                    schema: {},
                },
            };
        }
    }
}
let SwaggerBuilder = class SwaggerBuilder {
    constructor(settingManager) {
        this._settingManager = settingManager;
        this._apiPrefix = settingManager.GetConfig('apiPrefix') || 'api';
    }
    CreateSwaggerApi(app) {
        const router = new koa_router_1.default();
        const swagger = this.GenSwaggerJson();
        app.use((0, koa_static_1.default)((0, path_1.join)(__dirname, 'koa2-swagger-ui'), { maxage: 1000 * 60 * 60 })); // 允许浏览器进行304持久化,提升界面打开性能
        router.register('/swagger.json', ['get'], (ctx) => {
            ctx.set('Content-Type', 'application/json');
            ctx.body = swagger;
        });
        router.register('/swagger', ['get'], (0, index_1.koaSwagger)({
            routePrefix: false,
            swaggerOptions: {
                url: '/swagger.json',
            },
        }));
        app.use(router.routes());
        app.use(router.allowedMethods());
    }
    GenSwaggerJson() {
        const controllers = (0, Controller_2.GetAllControllers)();
        const tags = [];
        const paths = {};
        controllers.forEach((controller) => {
            const routerInfo = (0, Router_1.GetRouterInfo)(controller);
            const routerPath = routerInfo?.path;
            if (!(0, Controller_1.IsController)(controller) || !routerPath) {
                return;
            }
            const tag = (0, Controller_1.GetControllerName)(controller);
            tags.push({
                name: tag,
                description: routerInfo.desc,
            });
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
                const parameters = [];
                const actionParams = (0, RequestData_1.GetActionParamsMetadata)(property);
                if (actionParams) {
                    actionParams.forEach((actionParam) => {
                        const actionParamType = actionParam.type.name.toLowerCase();
                        if (actionParam.in === 'body') {
                            parameters.push({
                                name: 'data',
                                in: 'body',
                                type: 'object',
                                collectionFormat: 'multi',
                            });
                        }
                        else if (actionParam.in === 'query') {
                            let key = 'query';
                            if (actionParam.key) {
                                key = actionParam.key;
                            }
                            parameters.push({
                                in: 'query',
                                name: key,
                                type: actionParamType,
                                collectionFormat: 'multi',
                            });
                        }
                    });
                }
                const swaggerPath = new SwaggerPath(tag, parameters);
                if (actionInfo.desc) {
                    swaggerPath.summary = actionInfo.desc;
                }
                paths[fullPath] = { [(0, Request_1.GetHttpMethodStr)(actionInfo.httpMethod)]: swaggerPath };
            });
        });
        return {
            swagger: '2.0',
            info: {
                description: 'Swagger api for newbility',
                version: '1.0.0',
                title: 'Newbility Swagger',
            },
            schemes: ['http'],
            tags: tags,
            paths: paths,
        };
    }
};
SwaggerBuilder = __decorate([
    (0, core_1.Injectable)(),
    (0, core_1.Singleton)(exports.SWAGGER_BUILDER_INJECT_TOKEN),
    __param(0, (0, core_1.Inject)(core_1.SETTING_INJECT_TOKEN)),
    __metadata("design:paramtypes", [Object])
], SwaggerBuilder);
exports.SwaggerBuilder = SwaggerBuilder;
//# sourceMappingURL=SwaggerBuilder.js.map