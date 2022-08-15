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
exports.EventBus = exports.EVENT_BUS_INJECT_TOKEN = void 0;
const events_1 = __importDefault(require("events"));
const NewbilityError_1 = require("../error/NewbilityError");
const Dependency_1 = require("../di/Dependency");
const Logger_1 = require("../logger/Logger");
const EventHandler_1 = require("./EventHandler");
exports.EVENT_BUS_INJECT_TOKEN = (0, Dependency_1.GetInjectToken)('Sys:IEventBus');
let EventBus = class EventBus extends events_1.default {
    constructor(logger) {
        super();
        this.Logger = logger;
    }
    Publish(key, data) {
        this.emit(key, data);
    }
    Subscribe(key, handlerToken) {
        this.EventSubscribe('on', key, handlerToken);
    }
    SubscribeOnce(key, handlerToken) {
        this.EventSubscribe('once', key, handlerToken);
    }
    EventSubscribe(funcName, key, handlerToken) {
        this[funcName](key, async (data) => {
            try {
                const hanlder = Dependency_1.Container.resolve(handlerToken);
                if (hanlder instanceof EventHandler_1.EventHandler) {
                    await hanlder.HandleEventAsync(data);
                }
                else {
                    throw new NewbilityError_1.NewbilityError('handler must be EventHandler');
                }
            }
            catch (error) {
                this.Logger.LogError('执行事件出错', error);
            }
        });
    }
    UnSubscribe(key) {
        this.off(key, () => {
            this.Logger.LogDebug(`UnSubscribe ${key}`);
        });
    }
};
EventBus = __decorate([
    (0, Dependency_1.Singleton)(exports.EVENT_BUS_INJECT_TOKEN),
    (0, Dependency_1.Injectable)(),
    __param(0, (0, Dependency_1.Inject)(Logger_1.LOGGER_INJECT_TOKEN)),
    __metadata("design:paramtypes", [Object])
], EventBus);
exports.EventBus = EventBus;
//# sourceMappingURL=EventBus.js.map