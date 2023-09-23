import { Abstract, AllowMultiple, DefineMetadata, GetMetadataKey, GetInjectToken, Singleton, GetMetadata, NewbilityError } from '@newbility/core';
import { Namespace, Server, Socket } from 'socket.io';
import { GetSocketServer } from './SocketServer';
import jsonwebtoken from 'jsonwebtoken';

export const SOCKET_HUB_INJECT_TOKEN = GetInjectToken('Sys:ISocketHub');

export interface ISocketHub {
  Namespace: string | undefined;
  Init(serverOrNsp: Server | Namespace): void;
  OnConnection(socket: Socket): void;
}

@Singleton(SOCKET_HUB_INJECT_TOKEN)
@AllowMultiple()
@Abstract()
export abstract class SocketHub implements ISocketHub {
  private readonly _ns?: string;
  public get Namespace(): string | undefined {
    return this._ns;
  }

  private readonly _socketServer: Server;
  protected get SocketServer(): Server {
    return this._socketServer;
  }

  constructor(ns?: string) {
    this._ns = ns;
    this._socketServer = GetSocketServer();
  }

  /**
   * 连接之后
   * @param socket
   */
  OnConnection(socket: Socket): void {}

  /**
   * 初始化Socket连接
   * @param serverOrNsp SocketOrNamespace
   */
  Init(serverOrNsp: Server | Namespace) {}
}

@Abstract()
export abstract class AuthSocketHub extends SocketHub implements ISocketHub {
  protected Auth(socket: Socket): Promise<void> | void {
    let token: string | undefined = socket.handshake.auth.token;
    if (!token) token = socket.handshake.headers['authorization'];
    if (!token) {
      throw new NewbilityError('Not Authorized', {
        msg: 'token is null or empty',
      });
    }

    const task = new Promise<any>((res, rej) => {
      if (token) {
        const authSecret = this.GetAuthSecret();
        jsonwebtoken.verify(token.replace('Bearer ', ''), authSecret, (err, decoded) => {
          if (err) rej(err);
          else res(decoded);
        });
      }
    });

    task.then((data) => {
      socket.data.user = data;
    });

    return task;
  }

  protected abstract GetAuthSecret(): string;

  Init(serverOrNsp: Server | Namespace): void {
    serverOrNsp.use((socket, next) => {
      try {
        const task = this.Auth(socket);
        if (task instanceof Promise) {
          task
            .then(() => {
              next();
            })
            .catch((err) => {
              next(err as any);
            });
        }
      } catch (error) {
        next(error as any);
      }
    });
  }
}

const SOCKET_HUB_RECEIVE = GetMetadataKey('SocketHubReceive');

export function Receive(topic?: string) {
  return (target: any, key: string, descriptor: PropertyDescriptor) => {
    if (!topic) topic = key;
    DefineMetadata(SOCKET_HUB_RECEIVE, topic, descriptor.value);
  };
}

export function GetReceiveTopic(target: any): string | undefined {
  return GetMetadata(SOCKET_HUB_RECEIVE, target);
}
