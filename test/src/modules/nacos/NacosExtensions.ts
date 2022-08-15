import { Container, ISettingManager, SETTING_INJECT_TOKEN, NewbilityError } from '@newbility/core';
export function UseNascos(key?: string) {
  if (!key) key = 'nacos';
  const setting = Container.resolve<ISettingManager>(SETTING_INJECT_TOKEN);
  const nacosConfig = setting.GetConfig(key);
  if (!nacosConfig) {
    throw new NewbilityError(`缺少[${key}]配置`);
  }
  
}
