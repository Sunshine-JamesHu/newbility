"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalEvent2Handler = exports.LocalEventHandler = void 0;
const Dependency_1 = require("../../src/core/src/di/Dependency");
const EventHandler_1 = require("../../src/core/src/event/EventHandler");
let LocalEventHandler = class LocalEventHandler extends EventHandler_1.EventHandler {
    async HandleEventAsync(data) {
        console.log('收到事件1', data);
        return await Promise.resolve();
    }
};
LocalEventHandler = __decorate([
    (0, EventHandler_1.EventKey)('local.test'),
    (0, Dependency_1.Singleton)()
], LocalEventHandler);
exports.LocalEventHandler = LocalEventHandler;
let LocalEvent2Handler = class LocalEvent2Handler extends EventHandler_1.EventHandler {
    async HandleEventAsync(data) {
        console.log('收到事件2', data);
        return await Promise.resolve();
    }
};
LocalEvent2Handler = __decorate([
    (0, EventHandler_1.EventKey)('local_test'),
    (0, Dependency_1.Singleton)()
], LocalEvent2Handler);
exports.LocalEvent2Handler = LocalEvent2Handler;
//# sourceMappingURL=LocalEventHandler.js.map