"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KafkaConsumer = void 0;
const NewbilityError_1 = require("../../../core/src/error/NewbilityError");
const KafkaClient_1 = require("../KafkaClient");
class KafkaConsumer extends KafkaClient_1.KafkaClient {
    constructor(options) {
        super({
            ...options,
            disposeTime: -1,
            key: `${options.key}_consumer`,
        });
    }
    async DisconnectClient(c) {
        await c.disconnect();
    }
    async CreateClient() {
        if (!this.Options.clientId)
            throw new NewbilityError_1.NewbilityError('Must be have [clientId]');
        const consumer = this.Client.consumer({ groupId: this.Options.clientId });
        await consumer.connect();
        return consumer;
    }
}
exports.KafkaConsumer = KafkaConsumer;
//# sourceMappingURL=KafkaConsumer.js.map