import EventEmitter from 'events';
import { NewbilityError } from '../error/NewbilityError';
import { Container, GetInjectToken, Inject, Injectable, Singleton } from '../di/Dependency';
import { ILogger, LOGGER_INJECT_TOKEN as Logger_INJECT_TOKEN } from '../logger/Logger';
import { EventHandler, IEventHandler } from './EventHandler';

export const EVENT_BUS_INJECT_TOKEN = GetInjectToken('Sys:IEventBus');

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

@Singleton(EVENT_BUS_INJECT_TOKEN)
@Injectable()
export class EventBus extends EventEmitter implements IEventBus {
  protected readonly Logger: ILogger;
  constructor(@Inject(Logger_INJECT_TOKEN) logger: ILogger) {
    super();
    this.Logger = logger;
  }

  Publish(key: string, data: IEventData): void {
    this.emit(key, data);
  }

  Subscribe(key: string, handlerToken: string | Function): void {
    this.EventSubscribe('on', key, handlerToken);
  }

  SubscribeOnce(key: string, handlerToken: string | Function): void {
    this.EventSubscribe('once', key, handlerToken);
  }

  private EventSubscribe(funcName: 'on' | 'once', key: string, handlerToken: string | Function) {
    this[funcName](key, async (data: IEventData) => {
      try {
        const hanlder = Container.resolve<IEventHandler>(handlerToken as any);
        if (hanlder instanceof EventHandler) {
          await hanlder.HandleEventAsync(data);
        } else {
          throw new NewbilityError('handler must be EventHandler');
        }
      } catch (error) {
        this.Logger.LogError('执行事件出错', error);
      }
    });
  }

  UnSubscribe(key: string) {
    this.off(key, () => {
      this.Logger.LogDebug(`UnSubscribe ${key}`);
    });
  }
}
