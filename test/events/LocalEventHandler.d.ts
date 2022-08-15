import { IEventData } from '../../src/core/src/event/EventBus';
import { EventHandler } from '../../src/core/src/event/EventHandler';
export declare class LocalEventHandler extends EventHandler {
    HandleEventAsync(data: IEventData<{
        name: string;
    }>): Promise<void>;
}
export declare class LocalEvent2Handler extends EventHandler {
    HandleEventAsync(data: IEventData<{
        name: string;
    }>): Promise<void>;
}
