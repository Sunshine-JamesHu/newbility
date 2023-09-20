import { Abstract, AllowMultiple, DefineMetadata, GetMetadataKey, GetInjectToken, Singleton, GetMetadata } from '@newbility/core';
import { Server, Socket } from 'socket.io';
import { GetSocketServer } from './SocketServer';

export const SOCKET_HUB_INJECT_TOKEN = GetInjectToken('Sys:ISocketHub');

export interface ISocketHub {
  Namespace: string | undefined;
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
