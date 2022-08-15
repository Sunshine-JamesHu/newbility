import { HttpGet } from '../../src/koa-core/src/router/Request';
import { Controller } from '../../src/koa-core/src/controller/Controller';
import { RequestQuery } from '../../src/koa-core/src/router/RequestData';
import { Router } from '../../src/koa-core/src/router/Router';
import { Inject, Injectable, Transient } from '../../src/core/src/di/Dependency';
import { EVENT_BUS_INJECT_TOKEN, IEventBus } from '../../src/core/src/event/EventBus';

@Injectable()
@Transient()
@Router({ desc: '事件测试' })
export default class EventController extends Controller {
  constructor(@Inject(EVENT_BUS_INJECT_TOKEN) private readonly _eventBus: IEventBus) {
    super();
  }
  @HttpGet()
  Trigger(@RequestQuery('key') key: string) {
    this._eventBus.Publish(key, {
      data: {
        name: '触发事件',
      },
    });
  }
}
