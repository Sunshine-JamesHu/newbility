import { Consumer } from 'kafkajs';
import { KafkaClient } from '../KafkaClient';
import { KafkaOptions } from '../KafkaOptions';
export declare class KafkaConsumer extends KafkaClient<Consumer> {
    constructor(options: KafkaOptions);
    DisconnectClient(c: Consumer): Promise<void>;
    CreateClient(): Promise<Consumer>;
}
