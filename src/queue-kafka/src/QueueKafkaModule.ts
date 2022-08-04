import { ModulePath } from '../../core/src/modularity/AppModule';
import { Container, Inject, Injectable } from '../../core/src/di/Dependency';
import { DependsOn } from '../../core/src/modularity/DependsOn';
import { CoreModule } from '../../core/src/CoreModule';
import { QueueCoreModule } from '../../queue-core/src/QueueCoreModule';
import { QueueModule } from '../../queue-core/src/QueueModule';
import { KafkaPublisher } from './publisher/KafkaPublisher';
import { GetQueueInjectToken, QueueSubType } from '../../queue-core/src/Queue';
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
