import { EventKey, EVENT_HANDLER_METADATA } from '../../core/src/event/EventHandler';
import { GetInjectToken } from '../../core/src/di/Dependency';
import { DefineMetadata, GetMetadata } from '../../core/src/metadata/Metadata';

export enum QueueSubType {
  Publisher = 0,
  Subscriber = 1,
}

export const QUEUE_INJECT_TOKEN = GetInjectToken('Sys:Queue');
export function GetQueueInjectToken(key: string, subType: QueueSubType) {
  let subTypeKey = 'Publisher';
  if (subType === QueueSubType.Subscriber) subTypeKey = 'Subscriber';
  return GetInjectToken(`${QUEUE_INJECT_TOKEN}:${key}:${subTypeKey}`);
}

export const QUEUE_EVENT_HANDLER_METADATA = `${EVENT_HANDLER_METADATA}:Queue`;

export function QueueEventKey(topic: string, eventKey?: string) {
  if (!eventKey) eventKey = topic;
  const eventFunc = EventKey(eventKey);
  return (target: Function) => {
    eventFunc(target);
    DefineMetadata(
      QUEUE_EVENT_HANDLER_METADATA,
      {
        topic,
        eventKey: eventKey ?? topic,
      },
      target
    );
  };
}

export function GetQueueEventKey(target: Function): { topic: string; eventKey: string } {
  return GetMetadata(QUEUE_EVENT_HANDLER_METADATA, target);
}
