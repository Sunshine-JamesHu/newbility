# Newbility

一个基于 Koa2 的 NodeJS 服务端程序,拥有完整的 Koa 生态

# 功能

- 简单且易于使用的 Controller 和 Router
- 强大的依赖注入，支持依赖反转，接口注入等
- 无须配置的 Swagger 文档
- 简单易用的日志组件
- QueueManager 管道处理器 (支持`kafka`,`mqtt`)
- HttpClient 简单易用的 HttpClient
- Cache (支持 MemoryCache, Redis)
- BackgroundWorker 后台工作者
- Oss 存储支持(支持`local`,`minio`)

# 模板程序

请参照 `template` 文件夹中的 `README.md`

## 功能

### 发布订阅

#### 配置文件

在配置文件中添加如下配置

```
  "queues": {
    "kafkaTest": {  // 唯一Key
      "type": "kafka", // 消息管道类型(支持kafka和mqtt)
      "options": {
        "servers": "server.dev.ai-care.top:9092", // kafka地址
        "clientId": "koa_kafka_test" // clientId
      }
    },
    "mqttTest": { // 唯一Key
      "type": "mqtt", // 消息管道类型(支持kafka和mqtt)
      "options": {
        "address": "mqtt://192.168.1.82", // mqtt地址
        "clientId": "koa_mqtt_test", // clientId
        "userName": "ronds", // mqtt账号
        "password": "ronds@123" // mqtt密码
      }
    }
  }
```

#### 订阅

在入口文件中重写 StartQueues 函数进行订阅操作

```
class App extends Program {
  override StartQueues() {
    const factory = Container.resolve<IQueueManagerFactory>(QMF_INJECT_TOKEN);

    const kafkaManager = factory.GetQueueManager('kafkaTest');
    const mqttManager = factory.GetQueueManager('mqttTest');

    const mqttTestTopic = GetEventKey(MqttSubTest);
    mqttManager.Subscription(mqttTestTopic, 'simple_koa_test/#');

    const kafkaTestTopic = GetEventKey(KafkaSubTest);
    kafkaManager.Subscription(kafkaTestTopic, kafkaTestTopic);

    super.StartQueues();
  }
}

const app = new App(__dirname);
app.Start();
```

#### 发布

```
import { Inject, Injectable, Singleton } from '../../src/di/Dependency';
import { GetQueueToken, IQueueManager } from '../../src/queue/QueueManager';
import { Service } from '../../src/service/Service';

export interface IQueueTestService {
  PublishAsync(data: any): Promise<void>;
}

@Injectable()
@Singleton('IQueueTestService')
export class QueueTestService extends Service implements IQueueTestService {
  constructor(@Inject(GetQueueToken('mqttTest')) private pubQueueManager: IQueueManager) {
    super();
  }

  async PublishAsync(data: any): Promise<void> {
    await this.pubQueueManager.PublishAsync('simple_koa_test', data);
    await this.pubQueueManager.PublishAsync('simple_koa_test', Buffer.from(JSON.stringify(data), 'utf-8'));
  }
}


```

#### Oss 存储支持

Oss 存储由 服务`IOssService`与提供者`IOssProvider`组成，框架中已经实现`minio`与`local`的 Oss 存储

用法：
首先注册通用的`IOssService`,其中`UseOssProvider`有两个参数，type 为 Oss 提供者的 key,options 为 Oss 提供者的配置。如果 options 不指定的话，会从配置文件中的 oss 节点下拿一次

**注册**

```
class App extends Program {
  override OnPreApplicationInitialization() {
    super.OnPreApplicationInitialization();

    UseOssProvider('local'); // 可选项为 local,minio,自己实现的provider的唯一key
  }
}

```

**配置**

```
  "oss": {
    "minio": {
      "addr": "127.0.0.1",
      "port": 9000,
      "userName": "admin",
      "password": "Admin@123456",
      "useSSL": false
    },
    "local": {
      "dir": "data"
    }
  }
```

**用法**

```
@Transient()
@Injectable()
@Router({ desc: 'Oss存储测试' })
export default class OssController extends Controller {
  constructor(@Inject(OSS_SVC_INJECT_TOKEN) private readonly _ossService: IOssService) {
    super();
  }

  @HttpGet()
  async GetFile(@RequestQuery('path') path: string): Promise<Buffer> {
    const mimeType = lookup(path) || 'application/octet-stream';
    this.Context.set('Content-Type', mimeType);
    this.Context.set('Content-Disposition', `filename=${path.substring(path.indexOf('/') + 1)}`);
    const res = await this._ossService.GetAsync(path);
    return res;
  }

  @HttpPost()
  async UploadFile(@RequestBody() data: { group: string | undefined; data?: File }): Promise<string> {
    if (data && data.data) {
      const reader = fs.createReadStream(data.data.path);
      const buffer = await StreamHelper.StreamToBuffer(reader);
      return await this._ossService.SaveAsync(buffer, data.data.name || Guid.Create(), data.group);
    }
    throw new UserFriendlyError('请选择一个文件进行上传');
  }

  @HttpDelete()
  async DeleteFile(@RequestQuery('path') path: string): Promise<void> {
    await this._ossService.RemoveAsync(path);
  }
}

```
