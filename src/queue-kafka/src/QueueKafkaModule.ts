import { ModulePath, Container, Injectable, DependsOn, CoreModule } from '@newbility/core';
import { QueueCoreModule, QueueModule, GetQueueInjectToken, QueueSubType } from '@newbility/queue-core';
import { KafkaPublisher } from './publisher/KafkaPublisher';
import { KafkaSubscriber } from './subscriber/KafkaSubscriber';

@ModulePath(__dirname)
@Injectable()
@DependsOn(CoreModule, QueueCoreModule)
export class QueueKafkaModule extends QueueModule {
  constructor() {
    super('kafka');
  }

  protected RegisterQueue(key: string, options: any): void {
    const pubToken = GetQueueInjectToken(key, QueueSubType.Publisher);

    Container.registerInstance(
      pubToken,
      new KafkaPublisher({
        ...options,
        key: key,
      })
    );

    const subToken = GetQueueInjectToken(key, QueueSubType.Subscriber);
    Container.registerInstance(
      subToken,
      new KafkaSubscriber({
        ...options,
        key: key,
      })
    );
  }
}
