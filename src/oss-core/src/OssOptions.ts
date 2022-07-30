import { Container, GetInjectToken } from '../../core/src/di/Dependency';
import { ISettingManager, SETTING_INJECT_TOKEN } from '../../core/src/setting/SettingManager';

export const OSS_OPTIONS_INJECT_TOKEN = GetInjectToken('Sys:OssOptions');

export interface OssOptions {}

export function GetOssOptionsInjectToken(key: string) {
  if (!key) return OSS_OPTIONS_INJECT_TOKEN;
  return `${OSS_OPTIONS_INJECT_TOKEN}:${key}`;
}

export function ConfigureOssOptions(type: string, options?: OssOptions) {
  if (!options) {
    const settingManager = Container.resolve<ISettingManager>(SETTING_INJECT_TOKEN);
    options = settingManager.GetConfig(`oss:${type}`);
  }
  Container.register(GetOssOptionsInjectToken(type), { useValue: options });
}
