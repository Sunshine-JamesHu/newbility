import { QueueEventKey } from '@newbility/queue-core';
import { Singleton, IEventData, EventHandler } from '@newbility/core';

@QueueEventKey('test')
@Singleton()
export class QueueEventHandler extends EventHandler {
  async HandleEventAsync(data: IEventData<Buffer>): Promise<void> {
    const json = data.data.toString();
    console.log('收到Queue事件1', JSON.parse(json));
    return await Promise.resolve();
  }
}

@QueueEventKey('zmsignal')
@Singleton()
export class Queue2EventHandler extends EventHandler {
  async HandleEventAsync(data: IEventData<Buffer>): Promise<void> {
    const json = data.data.toString();
    console.log('收到Queue事件2', JSON.parse(json));
    return await Promise.resolve();
  }
}
