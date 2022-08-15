"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KafkaProducer = void 0;
const kafkajs_1 = require("kafkajs");
const KafkaClient_1 = require("../KafkaClient");
class KafkaProducer extends KafkaClient_1.KafkaClient {
    constructor(options) {
        super({
            ...options,
            key: `${options.key}_producer`,
        });
    }
    async DisconnectClient(c) {
        await c.disconnect();
    }
    async CreateClient() {
        const producer = this.Client.producer({ createPartitioner: kafkajs_1.Partitioners.DefaultPartitioner });
        await producer.connect();
        return producer;
    }
}
exports.KafkaProducer = KafkaProducer;
//# sourceMappingURL=KafkaProducer.js.map