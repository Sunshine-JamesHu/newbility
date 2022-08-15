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
exports.Subscriber = void 0;
const Logger_1 = require("../../../core/src/logger/Logger");
const Dependency_1 = require("../../../core/src/di/Dependency");
const EventBus_1 = require("../../../core/src/event/EventBus");
const NewbilityError_1 = require("../../../core/src/error/NewbilityError");
const Queue_1 = require("../Queue");
let Subscriber = class Subscriber {
    constructor() {
        this._handlerMap = new Map();
        this._logger = Dependency_1.Container.resolve(Logger_1.LOGGER_INJECT_TOKEN);
        this._eventBus = Dependency_1.Container.resolve(EventBus_1.EVENT_BUS_INJECT_TOKEN);
    }
    get HandlerMap() {
        return this._handlerMap;
    }
    get EventBus() {
        return this._eventBus;
    }
    get Logger() {
        return this._logger;
    }
    Subscription(event, topic) {
        if (typeof event === 'string') {
            if (!event)
                throw new NewbilityError_1.NewbilityError('Must be have [eventKey]');
            if (!topic)
                throw new NewbilityError_1.NewbilityError('Must be have [topic]');
            const eventKey = event;
            const keys = this._handlerMap.get(topic);
            if (keys) {
                keys.add(eventKey);
            }
            else {
                const set = new Set().add(eventKey);
                this._handlerMap.set(topic, set);
            }
        }
        else {
            const eventInfo = (0, Queue_1.GetQueueEventKey)(event);
            if (eventInfo) {
                this.Subscription(eventInfo.eventKey, eventInfo.topic);
            }
        }
    }
    UnSubscription(topic) {
        this._handlerMap.delete(topic);
    }
    async StartAsync() {
        const subTopicCount = this.HandlerMap.size;
        if (subTopicCount < 1)
            return; // 没有监听的Topic,直接不启动
        await this.StartQueueAsync();
    }
    StopAsync() {
        return Promise.resolve();
    }
    EmitEvent(eventKey, data) {
        this._eventBus.Publish(eventKey, data);
    }
};
Subscriber = __decorate([
    (0, Dependency_1.Abstract)(),
    __metadata("design:paramtypes", [])
], Subscriber);
exports.Subscriber = Subscriber;
//# sourceMappingURL=Subscriber.js.map