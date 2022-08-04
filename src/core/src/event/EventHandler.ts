import { Abstract } from '../di/Dependency';
import { DefineMetadata, GetMetadata, GetMetadataKey } from '../metadata/Metadata';
import { IEventData } from './EventBus';

export const EVENT_HANDLER_METADATA = GetMetadataKey('Sys:EventHandler');
export interface IEventHandler<TData = any> {
  HandleEventAsync(data: IEventData<TData>): Promise<void>;
}

export function EventKey(key: string) {
  return (target: Function) => {
    DefineMetadata(EVENT_HANDLER_METADATA, key, target);
  };
}

export function GetEventKey(target: Function): string {
  return GetMetadata(EVENT_HANDLER_METADATA, target);
}

export function IsEventHandler(target: Function) {
  return !!GetEventKey(target);
}

@Abstract()
export abstract class EventHandler<TData = any> implements IEventHandler<TData> {
  abstract HandleEventAsync(data: IEventData<TData>): Promise<void>;
}
