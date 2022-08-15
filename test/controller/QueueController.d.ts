import { Controller } from '../../src/koa-core/src/controller/Controller';
import { IQueueFactory } from '../../src/queue-core/src/QueueFactory';
export default class QueueController extends Controller {
    private readonly _queueFactory;
    constructor(_queueFactory: IQueueFactory);
    PostTest(data: any): Promise<number>;
}
