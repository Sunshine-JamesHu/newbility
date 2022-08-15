import { Singleton, IEventData, EventHandler, EventKey } from '@newbility/core';

@EventKey('local.test')
@Singleton()
export class LocalEventHandler extends EventHandler {
  async HandleEventAsync(data: IEventData<{ name: string }>): Promise<void> {
    console.log('收到事件1', data);
    return await Promise.resolve();
  }
}

@EventKey('local_test')
@Singleton()
export class LocalEvent2Handler extends EventHandler {
  async HandleEventAsync(data: IEventData<{ name: string }>): Promise<void> {
    console.log('收到事件2', data);
    return await Promise.resolve();
  }
}
