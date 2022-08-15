import { Producer } from 'kafkajs';
import { KafkaClient } from '../KafkaClient';
import { KafkaOptions } from '../KafkaOptions';
export declare class KafkaProducer extends KafkaClient<Producer> {
    constructor(options: KafkaOptions);
    DisconnectClient(c: Producer): Promise<void>;
    CreateClient(): Promise<Producer>;
}
