import { Producer } from 'kafkajs';
import { IQueueClient } from '../../../queue-core/src/QueueClient';
import { Publisher } from '../../../queue-core/src/publisher/Publisher';
import { KafkaOptions } from '../KafkaOptions';
export declare class KafkaPublisher extends Publisher {
    private readonly _queueClient;
    constructor(options: KafkaOptions);
    PublishAsync(topic: string, data: any): Promise<void>;
    BatchPublishAsync(topic: string, data: any[]): Promise<void>;
    protected GetQueueClient(options: KafkaOptions): IQueueClient<Producer>;
}
