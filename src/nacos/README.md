### @newbility/nacos

nacos 实现库,使用 nacos 实现 服务注册，配置拉取等相关功能

### 使用教程

```
// 在启动项目中重写 `InitSettingManager` 函数
class App extends Program {
  protected override async InitSettingManager(): Promise<void> {
    super.InitSettingManager();
    await UseNacosAsync();
  }
}

// 在Startup模块中添加`NacosModule`依赖项
@DependsOn(NacosModule)
export class Startup extends AppModule {}

```

### 配置文件

```
{
  "nacos": {
    "serverAddr": "127.0.0.1:8848",
    // "accessKey": "nacos",
    // "secretKey": "nacos",
    "namespace": "test",
    "requestTimeout": 6000,
    "configKeys": [
      "newbility-test",
      {
        "dataId": "newbility-test2",
        "needSubscribe": true
      }
    ],
    "appName": "newbility", // app名称
    "appIP": "192.168.1.1", // appIP地址,可选，默认本机IP
    "appPort": "28000", // app端口,可选，默认启动端口
  },
}
```
