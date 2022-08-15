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
exports.KoaCoreModule = void 0;
const koa_1 = __importDefault(require("koa"));
const koa_body_1 = __importDefault(require("koa-body"));
const koa_compress_1 = __importDefault(require("koa-compress"));
const koa_static_1 = __importDefault(require("koa-static"));
const Cors_1 = require("./cors/Cors");
const core_1 = require("@newbility/core");
const ControllerBuilder_1 = require("./controller/ControllerBuilder");
const SwaggerBuilder_1 = require("./swagger/SwaggerBuilder");
let KoaCoreModule = class KoaCoreModule extends core_1.AppModule {
    constructor(app, setting, ctlBuilder, swaggerBuilder) {
        super();
        this._app = app;
        this._setting = setting;
        this._ctlBuilder = ctlBuilder;
        this._swaggerBuilder = swaggerBuilder;
    }
    OnApplicationInitialization() {
        this.InitSysMiddlewares(); // 初始化系统中间件
        this._ctlBuilder.CreateControllers(); // 创建Controller
    }
    OnPostApplicationInitialization() {
        this.InitSwagger();
    }
    //#region  初始化Koa中间件
    InitSysMiddlewares() {
        this.InitCors();
        this.InitCompress();
        this.InitStaticResource();
        this.InitBody();
    }
    /**
     * 初始化跨域
     */
    InitCors() {
        const enableCors = this._setting.GetConfig('cors:enable');
        if (enableCors) {
            const options = this._setting.GetConfig('cors:options');
            (0, Cors_1.AddCors)(this._app, options);
        }
    }
    /**
     * 初始化压缩
     */
    InitCompress() {
        const app = this._app;
        app.use((0, koa_compress_1.default)({
            filter: (content_type) => {
                // 压缩Filter
                return /html|text|javascript|css|json/i.test(content_type);
            },
            threshold: 128 * 1024, // 超过128k就压缩
        }));
    }
    /**
     * 初始化静态资源
     */
    InitStaticResource() {
        const app = this._app;
        app.use((0, koa_static_1.default)(`${__dirname}/../public`, { maxage: 1000 * 60 * 60 }));
    }
    /**
     * 初始化Body参数
     */
    InitBody() {
        const app = this._app;
        let maxFileSize = this._setting.GetConfig('maxFileSize');
        if (!maxFileSize)
            maxFileSize = 200 * 1024 * 1024;
        app.use((0, koa_body_1.default)({
            parsedMethods: ['POST', 'PUT', 'PATCH', 'DELETE', 'GET', 'HEAD'],
            multipart: true,
            formidable: {
                maxFileSize: maxFileSize,
            },
        }));
    }
    //#endregion
    //#region  初始化Swagger
    InitSwagger() {
        const enabled = this._setting.GetConfig('swagger:enabled');
        if (enabled === undefined || enabled === true) {
            this._swaggerBuilder.CreateSwaggerApi(this._app);
        }
    }
};
KoaCoreModule = __decorate([
    (0, core_1.Injectable)(),
    (0, core_1.DependsOn)(core_1.CoreModule),
    (0, core_1.ModulePath)(__dirname),
    __param(0, (0, core_1.Inject)((0, core_1.GetInjectToken)('Sys:App'))),
    __param(1, (0, core_1.Inject)(core_1.SETTING_INJECT_TOKEN)),
    __param(2, (0, core_1.Inject)(ControllerBuilder_1.CTL_BUILDER_INJECT_TOKEN)),
    __param(3, (0, core_1.Inject)(SwaggerBuilder_1.SWAGGER_BUILDER_INJECT_TOKEN)),
    __metadata("design:paramtypes", [koa_1.default, Object, Object, Object])
], KoaCoreModule);
exports.KoaCoreModule = KoaCoreModule;
//# sourceMappingURL=KoaCoreModule.js.map