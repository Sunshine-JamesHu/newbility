import Koa from 'koa';
import jwt from 'koa-jwt';
import {
  DependsOn,
  AppModule,
  ModulePath,
  Container,
  Injectable,
  Inject,
  GetInjectToken,
  ISettingManager,
  SETTING_INJECT_TOKEN,
} from '@newbility/core';
import { KoaCoreModule } from '@newbility/koa-core';

import { OssCoreModule, UseOssProvider } from '@newbility/oss-core';
import { LocalOssModule, OSS_KEY as LOCAL_OSS_KEY } from '@newbility/oss-local';
import { MinioModule, OSS_KEY as MINIO_OSS_KEY } from '@newbility/minio';
// import { NacosModule } from '@newbility/nacos';

import { QueueCoreModule, IQueueFactory, QUEUE_FACTORY_INJECT_TOKEN } from '@newbility/queue-core';
import { QueueKafkaModule } from '@newbility/queue-kafka';
import { Queue2EventHandler } from './events/QueueEventHandler';
import { AxiosModule } from '@newbility/axios';
import { CronBackgroundWorkerModule } from '@newbility/background-worker-cron';
import { PostgresModule } from '@newbility/postgres';
import { MysqlModule } from '@newbility/mysql';

// import { PostgresModule } from '@newbility/postgres';
// import { MysqlModule } from '@newbility/mysql';

import { ISwaggerBuilder, SWAGGER_BUILDER_INJECT_TOKEN, SwaggerModule } from '@newbility/swagger';
import { KoaJwtModule } from '@newbility/koa-jwt';
import { AUTH_INJECT_TOKEN, IAuth } from '@newbility/koa-core';
import { SocketModule } from '@newbility/socket';
import { BackgroundJobModule } from '@newbility/background-job-core';

@Injectable()
@ModulePath(__dirname)
@DependsOn(
  KoaCoreModule,
  OssCoreModule,
  LocalOssModule,
  SwaggerModule,
  MinioModule,
  QueueCoreModule,
  QueueKafkaModule,
  AxiosModule,
  CronBackgroundWorkerModule,
  BackgroundJobModule,
  PostgresModule,
  MysqlModule,
  KoaJwtModule,
  SocketModule
)
export class Startup extends AppModule {
  public OnPreApplicationInitialization(): void {
    this.UseAuth({ secret: '1234567891' });
  }

  public OnApplicationInitialization(): void {
    // UseOssProvider(LOCAL_OSS_KEY); // 使用本地存储作为默认存储
    UseOssProvider(MINIO_OSS_KEY); // 使用Minio作做为默认存储

    // // 订阅
    // const queueFactory = Container.resolve<IQueueFactory>(QUEUE_FACTORY_INJECT_TOKEN);
    // const queueSubscriber = queueFactory.GetSubscriber();
    // queueSubscriber.Subscription('test', 'test');
    // queueSubscriber.Subscription(Queue2EventHandler);
  }

  public OnPostApplicationInitialization(): void {
    this.InitSwagger();
  }

  //#region  初始化Swagger

  protected InitSwagger() {
    const setting = Container.resolve<ISettingManager>(SETTING_INJECT_TOKEN);
    const enabled = setting.GetConfig<boolean | undefined>('swagger:enabled');
    if (enabled === undefined || enabled === true) {
      const swaggerBuilder = Container.resolve<ISwaggerBuilder>(SWAGGER_BUILDER_INJECT_TOKEN);
      const app = Container.resolve<Koa>(GetInjectToken('Sys:App'));
      swaggerBuilder.CreateSwaggerApi(app, {
        path: 'swagger',
        info: {
          title: 'Newbility-Test',
          description: '测试项目',
        },
        auth: {
          url: '/api/auth/login',
          responseConverter: (data: any) => {
            return data;
            // return {
            //   token: '12345678',
            //   expiresIn: 2 * 60 * 60,
            // };
          },
        },
      });
    }
  }

  //#endregion

  protected UseAuth(options: jwt.Options) {
    const auth = Container.resolve<IAuth>(AUTH_INJECT_TOKEN);
    auth.UseAuth(options);
  }
}
