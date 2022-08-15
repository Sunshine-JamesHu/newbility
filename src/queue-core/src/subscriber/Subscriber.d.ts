import { IRunnable } from '../../../core/src/sys/Runnable';
import { ILogger } from '../../../core/src/logger/Logger';
import { IEventBus, IEventData } from '../../../core/src/event/EventBus';
export interface ISubscriber extends IRunnable {
    /**
     * 订阅
     * @param eventHandler 事件
     */
    Subscription(eventHandler: any): void;
    /**
     * 订阅
     * @param topic 主题
     * @param eventKey 事件Key
     */
    Subscription(eventKey: string, topic: string): void;
    /**
     * 取消订阅
     * @param topic 主题
     */
    UnSubscription(topic: string): void;
}
export declare abstract class Subscriber implements ISubscriber {
    private readonly _handlerMap;
    protected get HandlerMap(): Map<string, Set<string>>;
    private readonly _eventBus;
    protected get EventBus(): IEventBus;
    private readonly _logger;
    protected get Logger(): ILogger;
    constructor();
    Subscription(eventKey: string, topic: string): void;
    Subscription(eventHandler: any): void;
    UnSubscription(topic: string): void;
    StartAsync(): Promise<void>;
    protected abstract StartQueueAsync(): Promise<void>;
    StopAsync(): Promise<void>;
    protected EmitEvent(eventKey: string, data: IEventData): void;
}
