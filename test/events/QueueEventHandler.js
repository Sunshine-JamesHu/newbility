"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Queue2EventHandler = exports.QueueEventHandler = void 0;
const Queue_1 = require("../../src/queue-core/src/Queue");
const Dependency_1 = require("../../src/core/src/di/Dependency");
const EventHandler_1 = require("../../src/core/src/event/EventHandler");
let QueueEventHandler = class QueueEventHandler extends EventHandler_1.EventHandler {
    async HandleEventAsync(data) {
        const json = data.data.toString();
        console.log('收到Queue事件1', JSON.parse(json));
        return await Promise.resolve();
    }
};
QueueEventHandler = __decorate([
    (0, Queue_1.QueueEventKey)('test'),
    (0, Dependency_1.Singleton)()
], QueueEventHandler);
exports.QueueEventHandler = QueueEventHandler;
let Queue2EventHandler = class Queue2EventHandler extends EventHandler_1.EventHandler {
    async HandleEventAsync(data) {
        const json = data.data.toString();
        console.log('收到Queue事件2', JSON.parse(json));
        return await Promise.resolve();
    }
};
Queue2EventHandler = __decorate([
    (0, Queue_1.QueueEventKey)('zmsignal'),
    (0, Dependency_1.Singleton)()
], Queue2EventHandler);
exports.Queue2EventHandler = Queue2EventHandler;
//# sourceMappingURL=QueueEventHandler.js.map