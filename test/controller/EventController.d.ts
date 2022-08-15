import { Controller } from '../../src/koa-core/src/controller/Controller';
import { IEventBus } from '../../src/core/src/event/EventBus';
export default class EventController extends Controller {
    private readonly _eventBus;
    constructor(_eventBus: IEventBus);
    Trigger(key: string): void;
}
