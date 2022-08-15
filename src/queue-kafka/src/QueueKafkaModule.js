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
exports.QueueKafkaModule = void 0;
const AppModule_1 = require("../../core/src/modularity/AppModule");
const Dependency_1 = require("../../core/src/di/Dependency");
const DependsOn_1 = require("../../core/src/modularity/DependsOn");
const CoreModule_1 = require("../../core/src/CoreModule");
const QueueCoreModule_1 = require("../../queue-core/src/QueueCoreModule");
const QueueModule_1 = require("../../queue-core/src/QueueModule");
const KafkaPublisher_1 = require("./publisher/KafkaPublisher");
const Queue_1 = require("../../queue-core/src/Queue");
const KafkaSubscriber_1 = require("./subscriber/KafkaSubscriber");
let QueueKafkaModule = class QueueKafkaModule extends QueueModule_1.QueueModule {
    constructor() {
        super('kafka');
    }
    RegisterQueue(key, options) {
        const pubToken = (0, Queue_1.GetQueueInjectToken)(key, Queue_1.QueueSubType.Publisher);
        Dependency_1.Container.registerInstance(pubToken, new KafkaPublisher_1.KafkaPublisher({
            ...options,
            key: key,
        }));
        const subToken = (0, Queue_1.GetQueueInjectToken)(key, Queue_1.QueueSubType.Subscriber);
        Dependency_1.Container.registerInstance(subToken, new KafkaSubscriber_1.KafkaSubscriber({
            ...options,
            key: key,
        }));
    }
};
QueueKafkaModule = __decorate([
    (0, AppModule_1.ModulePath)(__dirname),
    (0, Dependency_1.Injectable)(),
    (0, DependsOn_1.DependsOn)(CoreModule_1.CoreModule, QueueCoreModule_1.QueueCoreModule),
    __metadata("design:paramtypes", [])
], QueueKafkaModule);
exports.QueueKafkaModule = QueueKafkaModule;
//# sourceMappingURL=QueueKafkaModule.js.map