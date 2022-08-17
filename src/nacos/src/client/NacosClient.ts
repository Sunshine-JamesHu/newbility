import { ClientOptions, NacosConfigClient, NacosNamingClient } from 'nacos';
import { Container, ISettingManager, SETTING_INJECT_TOKEN, NewbilityError, ILogger, LOGGER_INJECT_TOKEN } from '@newbility/core';
import { NacosOptions } from '../NacosOptions';
import { CFG_KEY } from '../NacosCont';

function GetNacosConfig(): ClientOptions {
  const setting = Container.resolve<ISettingManager>(SETTING_INJECT_TOKEN);
  const options = setting.GetConfig<NacosOptions>(CFG_KEY);
  if (!options) {
    throw new NewbilityError(`缺少[${CFG_KEY}]配置`);
  }
  return options;
}

export function CreateConfigClient(options?: ClientOptions): NacosConfigClient {
  if (!options) {
    options = GetNacosConfig();
  }
  const configClient = new NacosConfigClient(options);
  return configClient;
}

export function CreateNamingClient(options?: ClientOptions): NacosNamingClient {
  const logger = Container.resolve<ILogger>(LOGGER_INJECT_TOKEN);
  if (!options) {
    options = GetNacosConfig();
  }

  if (!options.serverAddr) {
    throw new NewbilityError(`缺少[${CFG_KEY}.serverAddr]配置`);
  }

  // const nacoslogger: any = {
  //   log: logger.LogDebug,
  //   debug: logger.LogDebug,
  //   info: logger.LogDebug,
  //   warn: logger.LogDebug,
  //   error: logger.LogDebug,
  //   trace: logger.LogFatal,
  // };

  const client = new NacosNamingClient({
    logger: console,
    serverList: options.serverAddr,
    namespace: options.namespace,
  });

  return client;
}
