import { IRunnable } from '../../../core/src/sys/Runnable';
import { ILogger, LOGGER_INJECT_TOKEN } from '../../../core/src/logger/Logger';
import { Abstract, Container } from '../../../core/src/di/Dependency';
import { EVENT_BUS_INJECT_TOKEN, IEventBus, IEventData } from '../../../core/src/event/EventBus';
import { NewbilityError } from '../../../core/src/error/NewbilityError';
import { GetQueueEventKey } from '../Queue';

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

@Abstract()
export abstract class Subscriber implements ISubscriber {
  private readonly _handlerMap: Map<string, Set<string>>;
  protected get HandlerMap() {
    return this._handlerMap;
  }

  private readonly _eventBus: IEventBus;
  protected get EventBus() {
    return this._eventBus;
  }

  private readonly _logger: ILogger;
  protected get Logger() {
    return this._logger;
  }

  constructor() {
    this._handlerMap = new Map<string, Set<string>>();
    this._logger = Container.resolve<ILogger>(LOGGER_INJECT_TOKEN);
    this._eventBus = Container.resolve<IEventBus>(EVENT_BUS_INJECT_TOKEN);
  }

  Subscription(eventKey: string, topic: string): void;
  Subscription(eventHandler: any): void;

  Subscription(event: any, topic?: string): void {
    if (typeof event === 'string') {
      if (!event) throw new NewbilityError('Must be have [eventKey]');
      if (!topic) throw new NewbilityError('Must be have [topic]');

      const eventKey = event;
      const keys = this._handlerMap.get(topic);
      if (keys) {
        keys.add(eventKey);
      } else {
        const set = new Set<string>().add(eventKey);
        this._handlerMap.set(topic, set);
      }
    } else {
      const eventInfo = GetQueueEventKey(event);
      if (eventInfo) {
        this.Subscription(eventInfo.eventKey, eventInfo.topic);
      }
    }
  }

  UnSubscription(topic: string): void {
    this._handlerMap.delete(topic);
  }

  async StartAsync(): Promise<void> {
    const subTopicCount = this.HandlerMap.size;
    if (subTopicCount < 1) return; // 没有监听的Topic,直接不启动
    await this.StartQueueAsync();
  }

  protected abstract StartQueueAsync(): Promise<void>;

  StopAsync(): Promise<void> {
    return Promise.resolve();
  }

  protected EmitEvent(eventKey: string, data: IEventData) {
    this._eventBus.Publish(eventKey, data);
  }
}
