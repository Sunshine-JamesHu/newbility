import { DependsOn, AppModule, ModulePath, Container, Injectable } from '@newbility/core';
import { KoaCoreModule } from '@newbility/koa-core';
import { OssCoreModule, UseOssProvider } from '@newbility/oss-core';
import { LocalOssModule, OSS_KEY as LOCAL_OSS_KEY } from '@newbility/oss-local';
import { MinioModule, OSS_KEY as MINIO_OSS_KEY } from '@newbility/minio';
// import { NacosModule } from '@newbility/nacos';

import { QueueCoreModule, IQueueFactory, QUEUE_FACTORY_INJECT_TOKEN } from '@newbility/queue-core';
import { QueueKafkaModule } from '@newbility/queue-kafka';
import { Queue2EventHandler } from './events/QueueEventHandler';
import { AxiosModule } from '@newbility/axios';

@Injectable()
@ModulePath(__dirname)
@DependsOn(KoaCoreModule, OssCoreModule, LocalOssModule, MinioModule, QueueCoreModule, QueueKafkaModule, AxiosModule)
export class Startup extends AppModule {
  public OnApplicationInitialization(): void {
    UseOssProvider(LOCAL_OSS_KEY); // 使用本地存储作为默认存储
    // UseOssProvider(MINIO_OSS_KEY); // 使用Minio作做为默认存储

    // // 订阅
    // const queueFactory = Container.resolve<IQueueFactory>(QUEUE_FACTORY_INJECT_TOKEN);
    // const queueSubscriber = queueFactory.GetSubscriber();
    // queueSubscriber.Subscription('test', 'test');
    // queueSubscriber.Subscription(Queue2EventHandler);
  }
}
