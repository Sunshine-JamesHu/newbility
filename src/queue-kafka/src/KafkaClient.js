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
exports.KafkaClient = void 0;
const QueueClient_1 = require("../../queue-core/src/QueueClient");
const kafkajs_1 = require("kafkajs");
const Dependency_1 = require("../../core/src/di/Dependency");
let KafkaClient = class KafkaClient extends QueueClient_1.QueueClient {
    constructor(options) {
        super(`kafka_${options.key}`, options.disposeTime);
        this._kafkaClient = this.CreateKafkaClient(options);
        this._options = options;
    }
    get Client() {
        return this._kafkaClient;
    }
    get Options() {
        return this._options;
    }
    CreateKafkaClient(options) {
        return new kafkajs_1.Kafka({
            ...options,
            logCreator: this.GetKafkaLogger(this.Logger),
        });
    }
    GetKafkaLogger(logger) {
        return (logLevel) => {
            let levelLogger = (msg, ...args) => {
                logger.LogDebug(msg, args);
            };
            if (logLevel === kafkajs_1.logLevel.INFO) {
                levelLogger = (msg, ...args) => {
                    logger.LogInfo(msg, args);
                };
            }
            else if (logLevel === kafkajs_1.logLevel.WARN) {
                levelLogger = (msg, ...args) => {
                    logger.LogWarn(msg, args);
                };
            }
            else if (logLevel === kafkajs_1.logLevel.ERROR) {
                levelLogger = (msg, ...args) => {
                    logger.LogError(msg, args);
                };
            }
            return ({ namespace, level, label, log }) => {
                const { message, ...extra } = log;
                levelLogger(message, log);
            };
        };
    }
};
KafkaClient = __decorate([
    (0, Dependency_1.Abstract)(),
    __metadata("design:paramtypes", [Object])
], KafkaClient);
exports.KafkaClient = KafkaClient;
//# sourceMappingURL=KafkaClient.js.map