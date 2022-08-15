"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Startup = void 0;
const DependsOn_1 = require("../src/core/src/modularity/DependsOn");
const KoaCoreModule_1 = require("../src/koa-core/src/KoaCoreModule");
const AppModule_1 = require("../src/core/src/modularity/AppModule");
const Dependency_1 = require("../src/core/src/di/Dependency");
let Startup = class Startup extends AppModule_1.AppModule {
    OnApplicationInitialization() {
        // UseOssProvider(LOCAL_OSS_KEY); // 使用本地存储作为默认存储
        // UseOssProvider(MINIO_OSS_KEY); // 使用Minio作做为默认存储
        // // 订阅
        // const queueFactory = Container.resolve<IQueueFactory>(QUEUE_FACTORY_INJECT_TOKEN);
        // const queueSubscriber = queueFactory.GetSubscriber();
        // queueSubscriber.Subscription('test', 'test');
        // queueSubscriber.Subscription(Queue2EventHandler);
    }
};
Startup = __decorate([
    (0, Dependency_1.Injectable)(),
    (0, AppModule_1.ModulePath)(__dirname)
    // @DependsOn(KoaCoreModule, OssCoreModule, LocalOssModule, MinioModule, QueueCoreModule, QueueKafkaModule)
    ,
    (0, DependsOn_1.DependsOn)(KoaCoreModule_1.KoaCoreModule)
], Startup);
exports.Startup = Startup;
//# sourceMappingURL=Startup.js.map