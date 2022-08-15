// import { QueueEventKey } from '../../src/queue-core/src/Queue';
// import { Singleton } from '../../src/core/src/di/Dependency';
// import { IEventData } from '../../src/core/src/event/EventBus';
// import { EventHandler } from '../../src/core/src/event/EventHandler';

// @QueueEventKey('test')
// @Singleton()
// export class QueueEventHandler extends EventHandler {
//   async HandleEventAsync(data: IEventData<Buffer>): Promise<void> {
//     const json = data.data.toString();
//     console.log('收到Queue事件1', JSON.parse(json));
//     return await Promise.resolve();
//   }
// }

// @QueueEventKey('zmsignal')
// @Singleton()
// export class Queue2EventHandler extends EventHandler {
//   async HandleEventAsync(data: IEventData<Buffer>): Promise<void> {
//     const json = data.data.toString();
//     console.log('收到Queue事件2', JSON.parse(json));
//     return await Promise.resolve();
//   }
// }
