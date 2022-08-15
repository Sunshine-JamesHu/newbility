import * as fs from 'fs';
import JSON5 from 'json5';
import { GetInjectToken, Container, Singleton } from '../di/Dependency';

export const SETTING_INJECT_TOKEN = GetInjectToken('Sys:ISettingManager');

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

@Singleton(SETTING_INJECT_TOKEN)
export class SettingManager implements ISettingManager {
  GetConfig<TConfig = any>(key: string): TConfig | undefined;

  GetConfig(): any;

  GetConfig(key?: string): any {
    if (key) {
      const keyPath = key.split(':');
      let cfg: any = APP_CONFIG[keyPath[0]];
      for (let index = 1; index < keyPath.length; index++) {
        const element = keyPath[index];
        if (cfg) cfg = cfg[element];
        else return undefined;
      }
      return cfg;
    } else {
      return JSON.parse(JSON.stringify(APP_CONFIG)); // 深拷贝一次再出去
    }
  }

  SetConfig<TConfig = any>(cfg: TConfig): void {
    SetConfig(cfg);
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
  if (Container.isRegistered(SETTING_INJECT_TOKEN)) return; // 已经初始化将不再进行初始化
  try {
    let appConfig = '';
    if (process.env.Config_FILE && fs.existsSync(process.env.Config_FILE)) {
      appConfig = fs.readFileSync(process.env.Config_FILE, 'utf-8');
    } else {
      appConfig = fs.readFileSync('./app.config.json', 'utf-8');
    }
    if (!appConfig) throw new Error();
    SetConfig(JSON5.parse(appConfig));
  } catch (error) {
    console.warn('App配置为空,采用默认配置');
    SetConfig({
      port: 30000,
    });
  }
  Container.registerSingleton<ISettingManager>(SETTING_INJECT_TOKEN, SettingManager); // 直接注入到容器中
}
