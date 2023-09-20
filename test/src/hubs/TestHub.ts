import { Socket } from 'socket.io';
import { Injectable, Singleton } from '@newbility/core';
import { Receive, SocketHub } from '../../modules/socket/SocketHub';

@Injectable()
export class TestSocketHub extends SocketHub {
  constructor() {
    super('/test');
  }

  @Receive()
  public Message(socket: Socket, data: any) {
    console.log('[Message]收到消息', data);
  }

  @Receive('message')
  private Message2(socket: Socket, data: any) {
    console.log('[Message2]收到消息', data);
  }

  @Receive('aaaa')
  private AAA(socket: Socket, data: any) {
    console.log('[AAA]收到消息', data);
  }
}
