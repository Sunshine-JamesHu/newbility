# Newbility

一个基于 Koa2 的 NodeJS 服务端程序，拥有完整的 Koa 生态，使用纯后端语意开发。支持依赖反准，模块化等后端标准功能。

# 功能

- 简单且易于使用的 Controller 和 Router
- 强大的依赖注入，支持依赖反转，接口注入等
- 无须配置的 Swagger 文档
- 简单易用的日志组件
- QueueManager 管道处理器 (支持`kafka`,`mqtt`)
- HttpClient 简单易用的 Http 请求器(使用 `axios实现`)
- Cache (支持 `MemoryCache`, `redis`)
- BackgroundWorker 后台工作者(使用 `corn` 实现)
- Oss 存储支持(支持`local`,`minio`)
- Socket 实时通讯支持(使用`socket.io`实现)
- Database 数据库支持(支持 `mysql`, `postgres`)
- 配置中心支持 (支持 `nacos`, `consul`)

# 模板程序

请参照 `template` 文件夹中的 `README.md`

## 基础功能

### 依赖注入

Newbility 支持依赖注入，为了解耦与模块化，不使用常用的 Class 直接进行注册与获取，而是使用不可变字符串进行依赖注入的 Key 进行注入；（当然，你要是喜欢 Class 直接注入，框架也是允许的）

高级用法参考 `tsyringe` 的官方文档

#### 注入服务

注入方式可以采用手动注册与自动注册，建议采用自动注册
每一种注入方式都带一个 Token，不填写默认为本类的`Class`，填写后使用`String`为 Key 进行注入
`Controller`建议将 Token 放空，其他的不建议放空

```
// 多实例注入
export declare function Transient(token?: string): (target: Function) => void;

// 单实例注入
export declare function Singleton(token?: string): (target: Function) => void;

```

#### 解析依赖

目前只支持如下的两种方式进行依赖获取

```
// 构造函数注入
constructor(@Inject(SETTING_INJECT_TOKEN) private readonly _settingManager: ISettingManager) {
    super();
}

// 使用容器进行直接解析
Container.resolve<ILogger>(LOGGER_INJECT_TOKEN);

```

#### 多实例注入

如下为多实例注入 `AllowMultiple` 这个装饰器起关键作用

注入代码示例如下

```
export const SOCKET_HUB_INJECT_TOKEN = GetInjectToken('Sys:ISocketHub');

export interface ISocketHub {
  Namespace: string | undefined;
}

@Singleton(SOCKET_HUB_INJECT_TOKEN)
@AllowMultiple()
@Abstract()
export abstract class SocketHub implements ISocketHub {
  private readonly _ns?: string;
  public get Namespace(): string | undefined {
    return this._ns;
  }

  private readonly _socketServer: Server;
  protected get SocketServer(): Server {
    return this._socketServer;
  }

  constructor(ns?: string) {
    this._ns = ns;
    this._socketServer = GetSocketServer();
  }
}
```

取用代码如下

```
const hubs = Container.resolveAll<ISocketHub>(SOCKET_HUB_INJECT_TOKEN);
```

#### 替换注入

框架允许手动替换容器中注入的实例，也可以使用装饰器的方式进行替换 `ReplaceService` 起到关键作用，多个`ReplaceService`装饰器替换同一个服务，将使用最后一个替换注入的实现
手动替换参考 `tsyringe` 的官方文档

```
export interface ITestService {
  TestService(): string;
}

@Singleton('ITestService')
export class TestService extends Service implements ITestService {
  constructor() {
    super();
  }

  public TestService(): string {
    return 'TestService';
  }
}

@ReplaceService()
@Singleton('ITestService')
export class TestService3 extends Service implements ITestService {
  constructor() {
    super();
  }

  public TestService(): string {
    return 'TestService3';
  }
}

```

### 配置文件

所有配置文件都存放在 `app.config.json` 中

如下是基础配置，可以在配置文件中添加任意你需要的配置，并提供 `ISettingManager` 进行配置获取

```
{
  "port": 28000, // 端口号
  "apiPrefix": "api", // Api前缀
  "log": {
    "logLevel": "debug" // 日志等级
  },
  "swagger": {
    "enabled": true // 是否启用Swagger-UI
  },
  "cors": {
    "enable": true // 是否允许跨域
  }
}

```

可以使用如下的接口进行配置获取,多层配置使用`log:logLevel`进行获取

```
export interface ISettingManager {
    /**
     * 获取配置
     * @param key 配置Key
     */
    GetConfig<TConfig = any>(key: string): TConfig | undefined;
    /**
     * 获取配置
     */
    GetConfig(): any;
    /**
     * 设置配置
     * @param cfg 配置
     */
    SetConfig<TConfig = any>(cfg: TConfig): void;
}
```

### 日志

全局注入了`ILogger`组件，默认是使用了`log4js`进行实现，可以根据需求替换成任意实现

```
Container.resolve<ILogger>(LOGGER_INJECT_TOKEN); // 可以获取日志组件

```

### Api 接口

```
import { Controller, HttpGet, Router } from '@newbility/koa-core';
import { Injectable, ISettingManager, Transient, Inject, SETTING_INJECT_TOKEN } from '@newbility/core';

@Injectable() // 代表该类中需要解析注入其他的类
@Transient() // 多实例注册
@Router({ desc: 'Home' }) // 路由,可自定义
export default class HomeController extends Controller {
  private readonly _settingManager: ISettingManager;

  // 依赖注入方式如下
  constructor(@Inject(SETTING_INJECT_TOKEN) settingManager: ISettingManager) {
    super();
    this._settingManager = settingManager;
  }
  @HttpGet() // HttpGet装饰器
  GetVersion() {
    const version = this._settingManager.GetConfig('version') || '0.0.0';
    return { version };
  }

  @HttpGet()
  Health() {
    return { status: 'healthy' };
  }
}

```

## Newbility 组件

### 数据库模块

#### 数据库连接配置

数据库配置使用约定优先的方式进行实现，配置文件中进行几行简单的配置即可使用数据库

```
"databases": {
    "default": {
      "type": "postgres",
      "options": {
        "address": "127.0.0.1",
        "port": 5432,
        "database": "newbility",
        "userName": "postgres",
        "password": "Admin1234567_",
        "pool": {
          "min": 0,
          "max": 20
        }
      }
    },
    "mysql": {
      "type": "mysql",
      "options": {
        "address": "127.0.0.1",
        "port": 3306,
        "database": "newbility",
        "userName": "root",
        "password": "Admin1234567_",
        "pool": {
          "max": 20
        }
      }
    }
  }

```

#### 安装

使用`npm`或者`yarn`加载依赖包

```
npm install @newbility/postgres # pg 使用
npm install @newbility/mysql # mysql 使用

yarn add @newbility/postgres# pg 使用
yarn add @newbility/mysql# mysql 使用
```

然后在 Startup.ts 中将相关需要的模块加载进来(如果你是多模块的项目,在你需要使用的模块中加载即可)

```

@DependsOn(PostgresModule,MysqlModule)
export class Startup extends AppModule {
    // 代码
}

```

目前 database 包中提供了默认的 `IDatabaseProvider` 和 `IDatabaseProviderFactory`来提供支持

#### 配置文件

需要在`app.config.json`中加入如下配置

```
{
  "databases": {
    "default": {
      // 这里的 default 是标识使用哪个 Key 做为唯一的 Key,可以是任意值
      "type": "postgres", // 这里代表是数据库类型,目前已实现的有 mysql 和 postgres
      "options": {
        "address": "127.0.0.1", // 连接地址
        "port": 5432, // 连接端口
        "database": "newbility", // 数据库名称
        "userName": "postgres", // 用户名
        "password": "Admin1234567*", // 密码
        "pool": {
          "min": 0, // 连接池最小连接数
          "max": 20 // 连接池最大连接数量
        }
      }
    },
    "mysql": {
      "type": "mysql",
      "options": {
        "address": "127.0.0.1",
        "port": 3306,
        "database": "newbility",
        "userName": "root",
        "password": "Admin1234567*",
        "pool": {
          "max": 20
        }
      }
    }
  }
}

```

#### 使用说明

```
import {
  IDatabaseProvider, // 数据库默认代理器
  DB_PROVIDER_INJECT_TOKEN, // 注入Token
  IDatabaseProviderFactory, // 数据库代理工厂
  DB_PROVIDER_FAC_INJECT_TOKEN // 数据库代理工厂注入Token
} from '@newbility/database';

```

用法(建议使用对象的方式进行传参)

```

    const dbProvider = dbProviderFactory.GetProvider('default');

    // 使用对象传参
    const sql = `SELECT * FROM test WHERE id = :id and age < :age`;
    const res = await dbProvider.ExecuteAsync<any>(sql, { id, age });

    // 使用数组传参
    const sql = `SELECT * FROM test WHERE id = $0 and age < $1`; // pg
    // const sql = `SELECT * FROM test WHERE id = ? and age < ?`; // mysql
    const res = await dbProvider.ExecuteAsync<any>(sql, id, age);

```

### 发布订阅

#### 配置文件

在配置文件中添加如下配置

```
{
  "queues": {
    "kafkaTest": {
      // 唯一 Key
      "type": "kafka", // 消息管道类型(支持 kafka 和 mqtt)
      "options": {
        "servers": "server.dev.ai-care.top:9092", // kafka 地址
        "clientId": "koa_kafka_test" // clientId
      }
    },
    "mqttTest": {
      // 唯一 Key
      "type": "mqtt", // 消息管道类型(支持 kafka 和 mqtt)
      "options": {
        "address": "mqtt://192.168.1.82", // mqtt 地址
        "clientId": "koa_mqtt_test", // clientId
        "userName": "ronds", // mqtt 账号
        "password": "ronds@123" // mqtt 密码
      }
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

### Oss 存储支持

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
@Router({ desc: 'Oss 存储测试' })
export default class OssController extends Controller {
  constructor(@Inject(OSS_SVC_INJECT_TOKEN) private readonly _ossService: IOssService) {
    super();
  }

  @HttpGet()
  async GetFile(@RequestQuery('path') path: string): Promise<Buffer> {
    const mimeType = lookup(path) || 'application/octet-stream';
    this.Context.set('Content-Type', mimeType);
    this.Context.set('Content-Disposition', `filename=${path.substring(path.indexOf('/') + 1)}`);
    const res = await this.\_ossService.GetAsync(path);
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
    await this.\_ossService.RemoveAsync(path);
  }
}

```

### Socket 连接

#### 配置

这玩意没得配置,只需要重写一个函数将 Socket 启动即可

```
class App extends Program {
  protected RegisterCompToHttpServer(httpServer: Server) {
    AttachToServer(httpServer); // 附加到Http监听的端口上
  }
}

const app = new App(Startup);
app.Main();
```

#### 使用说明

```

import { Socket } from 'socket.io';
import { Injectable, Singleton } from '@newbility/core';
import { Receive, SocketHub } from '../../modules/socket/SocketHub';

@Injectable()
export class TestSocketHub extends SocketHub {
  constructor() {
    super('/test'); // 命名空间
  }

  @Receive() // 标记这个是一个接收信息的函数
  public Message(socket: Socket, data: any) {
    console.log('[Message]收到消息', data);
  }

  @Receive('message')
  private Message2(socket: Socket, data: any) {
    console.log('[Message2]收到消息', data);
  }

  @Receive('aaaa')
  private AAA(socket: Socket, data: any) {
    console.log('[AAA]收到消息', data);
  }
}


```

获取 SocketServer

```
GetSocketServer() // 这个函数可以获得Server的实例
```
