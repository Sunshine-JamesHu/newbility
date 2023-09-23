import { Injectable, AppModule, ModulePath, DependsOn, CoreModule, Container } from '@newbility/core';
import { CreateSocketServer, GetSocketServer } from './SocketServer';
import { GetReceiveTopic, ISocketHub, SOCKET_HUB_INJECT_TOKEN } from './SocketHub';
import { Namespace, Server as SocketServer } from 'socket.io';

@ModulePath(__dirname)
@Injectable()
@DependsOn(CoreModule)
export class SocketModule extends AppModule {
  OnApplicationInitialization(): void {
    this.InitSocketConn();
  }

  protected InitSocketConn() {
    if (Container.isRegistered(SOCKET_HUB_INJECT_TOKEN)) {
      CreateSocketServer();
      const hubs = Container.resolveAll<ISocketHub>(SOCKET_HUB_INJECT_TOKEN);
      const socketServer = GetSocketServer();

      for (let index = 0; index < hubs.length; index++) {
        const hub = hubs[index];

        let serverOrNsp: SocketServer | Namespace = socketServer;
        if (hub.Namespace) serverOrNsp = socketServer.of(hub.Namespace);

        hub.Init(serverOrNsp);

        const props = Object.getOwnPropertyNames(hub.constructor.prototype);
        serverOrNsp.on('connection', (socket) => {
          hub.OnConnection(socket);
          for (let index = 0; index < props.length; index++) {
            const actionKey = props[index];
            const action = (hub as any)[actionKey];
            if (actionKey === 'constructor' || typeof action !== 'function') continue;

            const topic = GetReceiveTopic(action);
            if (!topic) continue;

            socket.on(topic, (data) => {
              return (hub as any)[actionKey](socket, data); // 必要写法,否则会丢失this指向
            });
          }
        });
      }
    }
  }
}
