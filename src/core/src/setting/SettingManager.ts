import * as fs from 'fs';
import { GetInjectToken, Container, Singleton } from '../di/Dependency';

export const SETTING_INJECT_TOKEN = GetInjectToken('Sys:ISettingManager');

export interface ISettingManager {
  GetConfig<TConfig = any>(key: string): TConfig | undefined;
}

@Singleton(SETTING_INJECT_TOKEN)
export class SettingManager implements ISettingManager {
  GetConfig<TConfig = any>(key: string): TConfig | undefined {
    const keyPath = key.split(':');
    let cfg: any = APP_CONFIG[keyPath[0]];
    for (let index = 1; index < keyPath.length; index++) {
      const element = keyPath[index];
      if (cfg) cfg = cfg[element];
      else return undefined;
    }
    return cfg;
  }
}

const APP_CONFIG: { [key: string]: any } = {};
const SetConfig = (cfg: any) => {
  for (const key in cfg) {
    if (cfg.hasOwnProperty(key)) {
      APP_CONFIG[key] = cfg[key];
    }
  }
};

export function InitSettingManager() {
  try {
    let appConfig = '';
    if (process.env.Config_FILE && fs.existsSync(process.env.Config_FILE)) {
      appConfig = fs.readFileSync(process.env.Config_FILE, 'utf-8');
    } else {
      appConfig = fs.readFileSync('./app.config.json', 'utf-8');
    }
    if (!appConfig) throw new Error();
    SetConfig(JSON.parse(appConfig));
  } catch (error) {
    console.warn('App配置为空,采用默认配置');
    SetConfig({
      port: 30000,
    });
  }
  Container.registerSingleton<ISettingManager>(SETTING_INJECT_TOKEN, SettingManager); // 直接注入到容器中
}
