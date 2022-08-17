import os from 'os';

export class OsHelper {
  private constructor() {}

  static GetOsIPV4(): string {
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
