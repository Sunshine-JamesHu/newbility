import { HttpGet, HttpPost, Controller, RequestBody, RequestQuery, Router } from '@newbility/koa-core';
import { Inject, Injectable, Transient, EVENT_BUS_INJECT_TOKEN, IEventBus } from '@newbility/core';

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
