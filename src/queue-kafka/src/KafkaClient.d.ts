import { QueueClient } from '../../queue-core/src/QueueClient';
import { Kafka, logLevel as LogLevel } from 'kafkajs';
import { KafkaOptions } from './KafkaOptions';
import { ILogger } from '../../core/src/logger/Logger';
export declare abstract class KafkaClient<TClient> extends QueueClient<TClient> {
    private readonly _kafkaClient;
    protected get Client(): Kafka;
    private readonly _options;
    protected get Options(): KafkaOptions;
    constructor(options: KafkaOptions);
    protected CreateKafkaClient(options: KafkaOptions): Kafka;
    protected GetKafkaLogger(logger: ILogger): (logLevel: LogLevel) => ({ namespace, level, label, log }: any) => void;
}
