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
exports.KafkaPublisher = void 0;
const Publisher_1 = require("../../../queue-core/src/publisher/Publisher");
const KafkaProducer_1 = require("./KafkaProducer");
const Dependency_1 = require("../../../core/src/di/Dependency");
let KafkaPublisher = class KafkaPublisher extends Publisher_1.Publisher {
    constructor(options) {
        super();
        this._queueClient = this.GetQueueClient(options);
    }
    async PublishAsync(topic, data) {
        if (!topic)
            throw new Error('topic is not null or empry');
        if (!data)
            return;
        const isBuffer = data instanceof Buffer;
        if (!isBuffer) {
            if (Array.isArray(data) || typeof data === 'object') {
                data = JSON.stringify(data);
            }
        }
        const producer = await this._queueClient.GetClient();
        await producer.send({
            topic: topic,
            messages: [{ value: data }],
        });
    }
    BatchPublishAsync(topic, data) {
        throw new Error('Method not implemented.');
    }
    GetQueueClient(options) {
        return new KafkaProducer_1.KafkaProducer(options);
    }
};
KafkaPublisher = __decorate([
    (0, Dependency_1.Injectable)(),
    __metadata("design:paramtypes", [Object])
], KafkaPublisher);
exports.KafkaPublisher = KafkaPublisher;
//# sourceMappingURL=KafkaPublisher.js.map