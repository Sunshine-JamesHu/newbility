/// <reference types="node" />
import { IEventData } from '../../src/core/src/event/EventBus';
import { EventHandler } from '../../src/core/src/event/EventHandler';
export declare class QueueEventHandler extends EventHandler {
    HandleEventAsync(data: IEventData<Buffer>): Promise<void>;
}
export declare class Queue2EventHandler extends EventHandler {
    HandleEventAsync(data: IEventData<Buffer>): Promise<void>;
}
