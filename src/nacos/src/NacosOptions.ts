import { ClientOptions } from 'nacos';

export interface NacosConfigKey {
  dataId: string;
  group?: string;
  needSubscribe?: boolean;
}

export interface NacosOptions extends ClientOptions {
  configKeys: Array<NacosConfigKey | string>;
  appIP?: string;
  appPort?: number;
}
