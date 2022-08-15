import { IEventData } from './EventBus';
export declare const EVENT_HANDLER_METADATA: string;
export interface IEventHandler<TData = any> {
    HandleEventAsync(data: IEventData<TData>): Promise<void>;
}
export declare function EventKey(key: string): (target: Function) => void;
export declare function GetEventKey(target: Function): string;
export declare function IsEventHandler(target: Function): boolean;
export declare abstract class EventHandler<TData = any> implements IEventHandler<TData> {
    abstract HandleEventAsync(data: IEventData<TData>): Promise<void>;
}
