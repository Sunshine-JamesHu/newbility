/// <reference types="node" />
import EventEmitter from 'events';
import { ILogger } from '../logger/Logger';
export declare const EVENT_BUS_INJECT_TOKEN: string;
export interface IEventData<TData = any> {
    ext?: any;
    data: TData;
}
export interface IEventBus {
    /**
     * 发布事件
     * @param key 事件key
     * @param data 数据
     */
    Publish(key: string, data: IEventData): void;
    /**
     * 监听事件
     * @param key 事件Key
     * @param handlerToken 处理器Token / 回调函数
     */
    Subscribe(key: string, handlerToken: string | Function): void;
    /**
     * 监听事件
     * @param key 事件Key
     * @param handlerToken 处理器Token / 回调函数
     */
    SubscribeOnce(key: string, handlerToken: string | Function): void;
    /**
     * 取消订阅
     * @param key 事件Key
     */
    UnSubscribe(key: string): void;
}
export declare class EventBus extends EventEmitter implements IEventBus {
    protected readonly Logger: ILogger;
    constructor(logger: ILogger);
    Publish(key: string, data: IEventData): void;
    Subscribe(key: string, handlerToken: string | Function): void;
    SubscribeOnce(key: string, handlerToken: string | Function): void;
    private EventSubscribe;
    UnSubscribe(key: string): void;
}
