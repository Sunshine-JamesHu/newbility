import { Injectable, AppModule, ModulePath, DependsOn, CoreModule, Container } from '@newbility/core';
import { CreateSocketServer, GetSocketServer } from './SocketServer';
import { GetReceiveTopic, ISocketHub, SOCKET_HUB_INJECT_TOKEN } from './SocketHub';
import { Socket } from 'socket.io';
import { EventEmitter } from 'stream';

@ModulePath(__dirname)
@Injectable()
@DependsOn(CoreModule)
export class SocketModule extends AppModule {
  OnApplicationInitialization(): void {
    CreateSocketServer();
  }

  OnPostApplicationInitialization(): void {
    if (Container.isRegistered(SOCKET_HUB_INJECT_TOKEN)) {
      const hubs = Container.resolveAll<ISocketHub>(SOCKET_HUB_INJECT_TOKEN);
      const socketServer = GetSocketServer();
      const map: any = {};
      hubs.forEach((hub: any) => {
        console.log(hub.constructor.name);

        let ns = 'default';
        if (hub.Namespace) ns = hub.Namespace;

        if (!map[ns]) map[ns] = {};
        const nsMap = map[ns];

        // 获取所有公有函数
        const props = Object.getOwnPropertyNames(hub.constructor.prototype);
        for (let index = 0; index < props.length; index++) {
          const prop = props[index];
          if (prop === 'constructor' || typeof hub[prop] !== 'function') continue;
          const topic = GetReceiveTopic(hub[prop]);
          if (!topic) continue;

          nsMap[topic] = hub[prop];
        }
      });

      for (const ns in map) {
        if (Object.prototype.hasOwnProperty.call(map, ns)) {
          let server: EventEmitter = socketServer;
          if (ns !== 'default') {
            server = socketServer.of(ns);
          }
          server.on('connection', (socket) => {
            this.OnConnectioned(socket);
            for (const topic in map[ns]) {
              if (Object.prototype.hasOwnProperty.call(map[ns], topic)) {
                socket.on(topic, (data: any) => {
                  const func = map[ns][topic];
                  func(socket, data);
                });
              }
            }
          });
        }
      }
    }
  }

  protected OnConnectioned(socket: Socket) {
    // 重写这个函数,用来添加连接之后的其他操作
  }
}
