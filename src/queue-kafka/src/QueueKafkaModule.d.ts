import { QueueModule } from '../../queue-core/src/QueueModule';
export declare class QueueKafkaModule extends QueueModule {
    constructor();
    protected RegisterQueue(key: string, options: any): void;
}
