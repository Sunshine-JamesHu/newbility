import { OssOptions } from '@newbility/oss-core';

export interface MinioOptions extends OssOptions {
  /**
   * 地址
   */
  addr: string;
  /**
   * 端口号
   */
  port?: number;
  /**
   * 是否为SSL
   */
  useSSL?: boolean;
  /**
   * 账号
   */
  userName: string;
  /**
   * 密码
   */
  password: string;
}
