import { Socket } from 'socket.io';
import { Injectable, Singleton } from '@newbility/core';
import { AuthSocketHub, Receive, SocketHub } from '@newbility/socket';

@Injectable()
export class TestSocketHub extends SocketHub {
  constructor() {
    super();
  }

  @Receive()
  public Message(socket: Socket, data: any) {
    console.log(this.Namespace);
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

@Injectable()
export class AuthTestSocketHub extends AuthSocketHub {
  constructor() {
    super('/auth');
  }

  protected GetAuthSecret(): string {
    return '1234567891';
  }

  @Receive('auth')
  private AAA(socket: Socket, data: any) {
    console.log('[AAA]当前用户为', socket.data.user);
    console.log('[AAA]收到消息', data);
  }
}
