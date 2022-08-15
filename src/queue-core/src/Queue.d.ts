export declare enum QueueSubType {
    Publisher = 0,
    Subscriber = 1
}
export declare const QUEUE_INJECT_TOKEN: string;
export declare function GetQueueInjectToken(key: string, subType: QueueSubType): string;
export declare const QUEUE_EVENT_HANDLER_METADATA: string;
export declare function QueueEventKey(topic: string, eventKey?: string): (target: Function) => void;
export declare function GetQueueEventKey(target: Function): {
    topic: string;
    eventKey: string;
};
