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
  OsHelper,
} from '@newbility/core';
import { NacosConfigClient, NacosNamingClient } from 'nacos';
import JSON5 from 'json5';
import { NacosConfigKey, NacosOptions } from './NacosOptions';
import { CFG_KEY } from './NacosCont';
import { CreateConfigClient, CreateNamingClient } from './client/NacosClient';

interface RegisterIns {
  name: string;
  ip: string;
  port: number;
  group?: string;
  metadata?: any;
}

@Injectable()
@ModulePath(__dirname)
@DependsOn(CoreModule)
export class NacosModule extends AppModule {
  private readonly _setting: ISettingManager;
  private readonly _nacosConfig: NacosOptions;
  private readonly _configClient: NacosConfigClient;
  private readonly _namingClient: NacosNamingClient;

  private readonly _registerIns: RegisterIns;

  constructor(@Inject(SETTING_INJECT_TOKEN) setting: ISettingManager) {
    super();
    this._setting = setting;

    const nacosConfig = this.GetNacosConfig();
    this._nacosConfig = nacosConfig as any;

    this._registerIns = this.GetRegisterIns(this._nacosConfig);

    this._configClient = CreateConfigClient(nacosConfig);
    this._namingClient = CreateNamingClient(nacosConfig);
  }

  public async OnApplicationInitialization(): Promise<void> {
    this.SubConfigChange(this._nacosConfig);
    await this.RegisterInstance();
  }

  public async OnApplicationShutdown(): Promise<void> {
    await this.DeregisterInstance();
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

  private async RegisterInstance() {
    const client = this._namingClient;
    await client.ready();
    await client.registerInstance(
      this._registerIns.name,
      {
        ip: this._registerIns.ip,
        port: this._registerIns.port,
        metadata: this._registerIns.metadata,
      } as any,
      this._registerIns.group
    );
  }

  private async DeregisterInstance() {
    const client = this._namingClient;
    await client.ready();
    await client.deregisterInstance(
      this._registerIns.name,
      {
        ip: this._registerIns.ip,
        port: this._registerIns.port,
        metadata: this._registerIns.metadata,
      } as any,
      this._registerIns.group
    );
  }

  private GetNacosConfig(): NacosOptions {
    const config = this._setting.GetConfig<NacosOptions>(CFG_KEY);
    if (!config) {
      throw new NewbilityError(`缺少[${CFG_KEY}]配置`);
    }
    return config;
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

  private GetRegisterIns(config: NacosOptions): RegisterIns {
    if (!config.appName) throw new NewbilityError(`缺少[${CFG_KEY}.appName]配置`);
    const ip = config.appIP ?? OsHelper.GetOsIPV4();
    const port = config.appPort ?? this._setting.GetConfig<number>('port') ?? 30000;
    return {
      name: config.appName,
      ip,
      port,
      metadata: {
        framework: 'newbility',
      },
    };
  }
}
