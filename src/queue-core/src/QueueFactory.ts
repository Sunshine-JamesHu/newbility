import { ISubscriber } from './subscriber/Subscriber';
import { IPublisher } from './publisher/Publisher';
import { Container, GetInjectToken, Singleton } from '../../core/src/di/Dependency';
import { GetQueueInjectToken, QueueSubType } from './Queue';

export const QUEUE_FACTORY_INJECT_TOKEN = GetInjectToken('IQueueFactory');

export interface IQueueFactory {
  GetPublisher(key?: string): IPublisher;
  GetSubscriber(key?: string): ISubscriber;
}

@Singleton(QUEUE_FACTORY_INJECT_TOKEN)
export class QueueFactory implements IQueueFactory {
  GetPublisher(key?: string): IPublisher {
    if (!key) key = 'default';
    return this.GetPublisherOrSubscriber(key, QueueSubType.Publisher) as IPublisher;
  }

  GetSubscriber(key?: string): ISubscriber {
    if (!key) key = 'default';
    return this.GetPublisherOrSubscriber(key, QueueSubType.Subscriber) as ISubscriber;
  }

  protected GetPublisherOrSubscriber(key: string, subType: QueueSubType): IPublisher | ISubscriber {
    const token = GetQueueInjectToken(key, subType);
    const queue = Container.resolve<IPublisher | ISubscriber>(token);
    return queue;
  }
}
