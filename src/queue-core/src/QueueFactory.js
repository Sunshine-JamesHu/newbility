"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueueFactory = exports.QUEUE_FACTORY_INJECT_TOKEN = void 0;
const Dependency_1 = require("../../core/src/di/Dependency");
const Queue_1 = require("./Queue");
exports.QUEUE_FACTORY_INJECT_TOKEN = (0, Dependency_1.GetInjectToken)('IQueueFactory');
let QueueFactory = class QueueFactory {
    GetPublisher(key) {
        if (!key)
            key = 'default';
        return this.GetPublisherOrSubscriber(key, Queue_1.QueueSubType.Publisher);
    }
    GetSubscriber(key) {
        if (!key)
            key = 'default';
        return this.GetPublisherOrSubscriber(key, Queue_1.QueueSubType.Subscriber);
    }
    GetPublisherOrSubscriber(key, subType) {
        const token = (0, Queue_1.GetQueueInjectToken)(key, subType);
        const queue = Dependency_1.Container.resolve(token);
        return queue;
    }
};
QueueFactory = __decorate([
    (0, Dependency_1.Singleton)(exports.QUEUE_FACTORY_INJECT_TOKEN)
], QueueFactory);
exports.QueueFactory = QueueFactory;
//# sourceMappingURL=QueueFactory.js.map