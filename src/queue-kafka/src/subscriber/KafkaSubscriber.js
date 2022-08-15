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
exports.KafkaSubscriber = void 0;
const KafkaConsumer_1 = require("./KafkaConsumer");
const Dependency_1 = require("../../../core/src/di/Dependency");
const Subscriber_1 = require("../../../queue-core/src/subscriber/Subscriber");
let KafkaSubscriber = class KafkaSubscriber extends Subscriber_1.Subscriber {
    constructor(options) {
        super();
        this._queueClient = this.GetQueueClient(options);
    }
    async StartQueueAsync() {
        // const subTopics = this.HandlerMap.keys();
        // const subTopicCount = this.HandlerMap.size;
        const consumer = await this._queueClient.GetClient();
        for (let x of this.HandlerMap) {
            const topic = x[0];
            await consumer.subscribe({ topic: topic, fromBeginning: true });
        }
        // for (let index = 0; index < subTopicCount; index++) {
        //   const topic = subTopics[index];
        //   await consumer.subscribe({ topic: topic, fromBeginning: true });
        // }
        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                this.OnMessage({ topic: topic, value: message.value });
            },
        });
    }
    GetQueueClient(options) {
        return new KafkaConsumer_1.KafkaConsumer(options);
    }
    OnMessage(message) {
        const eventKeys = this.HandlerMap.get(message.topic);
        if (eventKeys) {
            eventKeys.forEach((eventKey) => {
                if (eventKey) {
                    this.EmitEvent(eventKey, {
                        ext: {
                            topic: message.topic,
                        },
                        data: message.value,
                    });
                }
            });
        }
    }
};
KafkaSubscriber = __decorate([
    (0, Dependency_1.Injectable)(),
    __metadata("design:paramtypes", [Object])
], KafkaSubscriber);
exports.KafkaSubscriber = KafkaSubscriber;
//# sourceMappingURL=KafkaSubscriber.js.map