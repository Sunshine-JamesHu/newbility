import { Container, GetInjectToken, SETTING_INJECT_TOKEN, ISettingManager } from '@newbility/core';
import { ServerOptions, Server as SocketServer } from 'socket.io';
import { Server } from 'http';

const SOCKET_SERVER_INJECT_TOKEN: string = GetInjectToken('Sys:SocketServer');

export function CreateSocketServer() {
  if (!Container.isRegistered(SOCKET_SERVER_INJECT_TOKEN)) {
    const settingManager = Container.resolve<ISettingManager>(SETTING_INJECT_TOKEN);
    const enabled = settingManager.GetConfig<boolean>('cors:enable');
    const options: Partial<ServerOptions> = {
      path: '/socket',
    };
    if (enabled) options.cors = { origin: '*' }; // 跨域
    const server = new SocketServer(options);
    Container.register(SOCKET_SERVER_INJECT_TOKEN, { useValue: server }); // 注册到容器中
  }
}

export function GetSocketServer() {
  return Container.resolve<SocketServer>(SOCKET_SERVER_INJECT_TOKEN);
}

export function AttachToServer(httpServer: Server) {
  GetSocketServer().attach(httpServer);
}
