import {
  DependsOn,
  AppModule,
  ModulePath,
  Injectable,
  Inject,
  SETTING_INJECT_TOKEN,
  ISettingManager,
  CoreModule,
  NewbilityError,
} from '@newbility/core';
import { NacosConfigClient, NacosNamingClient } from 'nacos';
import JSON5 from 'json5';
import os from 'os';
import { NacosConfigKey, NacosOptions } from './NacosOptions';
import { CFG_KEY } from './NacosCont';
import { CreateConfigClient, CreateNamingClient } from './client/NacosClient';

@Injectable()
@ModulePath(__dirname)
@DependsOn(CoreModule)
export class NacosModule extends AppModule {
  private readonly _setting: ISettingManager;
  private readonly _configClient: NacosConfigClient;
  private readonly _namingClient: NacosNamingClient;
  constructor(@Inject(SETTING_INJECT_TOKEN) setting: ISettingManager) {
    super();
    this._setting = setting;
    this._configClient = CreateConfigClient();
    this._namingClient = CreateNamingClient();
  }

  public async OnApplicationInitialization(): Promise<void> {
    const config = this.GetNacosConfig();
    if (config) {
      this.SubConfigChange(config);
      await this.RegisterInstance(config);
    }
  }

  public async OnApplicationShutdown(): Promise<void> {
    const config = this.GetNacosConfig();
    if (config) {
      await this.DeregisterInstance(config);
    }
  }

  private SubConfigChange(config: NacosOptions) {
    const configKeys = config.configKeys;
    if (configKeys && configKeys.length) {
      for (let index = 0; index < configKeys.length; index++) {
        const element = configKeys[index];
        const configKey = this.GetConfigKey(element);
        this._configClient.subscribe(configKey, (content: any) => {
          // 将变更后的配置塞入配置中
          try {
            const config = JSON5.parse(content);
            if (config) this._setting.SetConfig(config);
          } catch {
            // 捕获错误配置，不更新现有配置
          }
        });
      }
    }
  }

  private async RegisterInstance(config: NacosOptions) {
    if (!config.appName) throw new NewbilityError(`缺少[${CFG_KEY}.appName]配置`);

    const client = this._namingClient;
    await client.ready();
    await client.registerInstance(config.appName, {
      ip: config.appIP ?? this.GetAppIP(),
      port: config.appPort ?? this._setting.GetConfig<number>('port') ?? 30000,
    });
  }

  private async DeregisterInstance(config: NacosOptions) {
    if (!config.appName) throw new NewbilityError(`缺少[${CFG_KEY}.appName]配置`);

    const client = this._namingClient;
    await client.ready();
    await client.deregisterInstance(config.appName, {
      ip: config.appIP ?? this.GetAppIP(),
      port: config.appPort ?? this._setting.GetConfig<number>('port') ?? 30000,
    });
  }

  private GetNacosConfig(): NacosOptions | undefined {
    return this._setting.GetConfig<NacosOptions>(CFG_KEY);
  }

  private GetConfigKey(key: string | NacosConfigKey) {
    const configKey: { dataId: string; group: string } = { group: 'DEFAULT_GROUP' } as any;
    if (typeof key === 'string') {
      configKey.dataId = key;
    } else {
      configKey.dataId = key.dataId;
      if (key.group) configKey.group = key.group;
    }
    return configKey;
  }

  private GetAppIP(): string {
    const interfaces = os.networkInterfaces();
    for (var devName in interfaces) {
      const iface: any = interfaces[devName];
      for (var i = 0; i < iface.length; i++) {
        var alias = iface[i];
        if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
          return alias.address;
        }
      }
    }
    return '127.0.0.1';
  }
}
