import { DependsOn, AppModule, ModulePath, Injectable, CoreModule, Container, SETTING_INJECT_TOKEN, ISettingManager } from '@newbility/core';
import { NacosConfigClient } from 'nacos';

@Injectable()
@ModulePath(__dirname)
@DependsOn(CoreModule)
export class NacosModule extends AppModule {
  public async OnPreApplicationInitialization() {
    const configClient = new NacosConfigClient({
      serverAddr: '127.0.0.1:8848',
      accessKey: 'nacos',
      secretKey: 'nacos',
      namespace: 'test',
      requestTimeout: 6000,
    });

    const content = await configClient.getConfig('newbility-test', 'DEFAULT_GROUP');
    const config = JSON.parse(content);

    const setting = Container.resolve<ISettingManager>(SETTING_INJECT_TOKEN);
  }
}
