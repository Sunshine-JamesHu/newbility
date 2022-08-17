import { NacosConfigClient } from 'nacos';
import JSON5 from 'json5';
import { Container, ISettingManager, SETTING_INJECT_TOKEN, NewbilityError } from '@newbility/core';
import { NacosOptions } from './NacosOptions';
import { CFG_KEY } from './NacosCont';
import { CreateConfigClient } from './client/NacosClient';

export async function UseNacosAsync() {
  const setting = Container.resolve<ISettingManager>(SETTING_INJECT_TOKEN);
  const nacosConfig = setting.GetConfig<NacosOptions>(CFG_KEY);
  if (!nacosConfig) {
    throw new NewbilityError(`缺少[${CFG_KEY}]配置`);
  }
  const configClient: NacosConfigClient = CreateConfigClient(nacosConfig);
  for (let index = 0; index < nacosConfig.configKeys.length; index++) {
    const element = nacosConfig.configKeys[index];

    const configKey: { dataId: string; group: string } = { group: 'DEFAULT_GROUP' } as any;

    if (typeof element === 'string') {
      configKey.dataId = element;
    } else {
      configKey.dataId = element.dataId;
      if (element.group) configKey.group = element.group;
    }

    //#region 拉取云端配置

    const json = await configClient.getConfig(configKey.dataId, configKey.group ?? 'DEFAULT_GROUP');
    if (json) {
      const config = JSON5.parse(json);
      if (config) {
        // 新老配置进行合并
        for (const key in config) {
          if (Object.prototype.hasOwnProperty.call(config, key)) {
            const newConfig = config[key];
            const oldConfig = setting.GetConfig(key);
            if (oldConfig) {
              config[key] = { ...newConfig, ...oldConfig };
            }
          }
        }
        setting.SetConfig(config);
      }
    }

    //#endregion
  }
}
