import { ISubscriber } from './subscriber/Subscriber';
import { IPublisher } from './publisher/Publisher';
import { QueueSubType } from './Queue';
export declare const QUEUE_FACTORY_INJECT_TOKEN: string;
export interface IQueueFactory {
    GetPublisher(key?: string): IPublisher;
    GetSubscriber(key?: string): ISubscriber;
}
export declare class QueueFactory implements IQueueFactory {
    GetPublisher(key?: string): IPublisher;
    GetSubscriber(key?: string): ISubscriber;
    protected GetPublisherOrSubscriber(key: string, subType: QueueSubType): IPublisher | ISubscriber;
}
