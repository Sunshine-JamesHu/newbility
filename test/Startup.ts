import { DependsOn } from '../src/core/src/modularity/DependsOn';
import { KoaCoreModule } from '../src/koa-core/src/KoaCoreModule';
import { AppModule, ModulePath } from '../src/core/src/modularity/AppModule';
import { Container, Injectable } from '../src/core/src/di/Dependency';
import { OssCoreModule } from '../src/oss-core/src/OssCoreModule';
import { UseOssProvider } from '../src/oss-core/src/OssProvider';
import { LocalOssModule } from '../src/oss-local/src/LocalOssModule';
import { OSS_KEY as LOCAL_OSS_KEY } from '../src/oss-local/src/LocalOssConst';
import { MinioModule } from '../src/minio/src/MinioModule';
import { OSS_KEY as MINIO_OSS_KEY } from '../src/minio/src/MinioConst';
import { QueueCoreModule } from '../src/queue-core/src/QueueCoreModule';
import { QueueKafkaModule } from '../src/queue-kafka/src/QueueKafkaModule';
import { IQueueFactory, QUEUE_FACTORY_INJECT_TOKEN } from '../src/queue-core/src/QueueFactory';
import { Queue2EventHandler } from './events/QueueEventHandler';

@Injectable()
@ModulePath(__dirname)
// @DependsOn(KoaCoreModule, OssCoreModule, LocalOssModule, MinioModule, QueueCoreModule, QueueKafkaModule)
@DependsOn(KoaCoreModule)
export class Startup extends AppModule {
  public OnApplicationInitialization(): void {
    // UseOssProvider(LOCAL_OSS_KEY); // 使用本地存储作为默认存储
    // UseOssProvider(MINIO_OSS_KEY); // 使用Minio作做为默认存储

    // // 订阅
    // const queueFactory = Container.resolve<IQueueFactory>(QUEUE_FACTORY_INJECT_TOKEN);
    // const queueSubscriber = queueFactory.GetSubscriber();

    // queueSubscriber.Subscription('test', 'test');
    // queueSubscriber.Subscription(Queue2EventHandler);
  }
}
