import { Consumer } from 'kafkajs';
import { IQueueClient } from '../../../queue-core/src/QueueClient';
import { KafkaOptions } from '../KafkaOptions';
import { Subscriber } from '../../../queue-core/src/subscriber/Subscriber';
export declare class KafkaSubscriber extends Subscriber {
    private readonly _queueClient;
    constructor(options: KafkaOptions);
    StartQueueAsync(): Promise<void>;
    protected GetQueueClient(options: KafkaOptions): IQueueClient<Consumer>;
    protected OnMessage(message: any): void;
}
