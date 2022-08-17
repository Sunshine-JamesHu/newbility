import { HttpPost, Controller, RequestBody, Router } from '@newbility/koa-core';
import { Inject, Injectable, Transient } from '@newbility/core';
import { IQueueFactory, QUEUE_FACTORY_INJECT_TOKEN } from '@newbility/queue-core';
import moment from 'moment';

@Injectable()
@Transient()
@Router({ desc: '管道测试' })
export default class QueueController extends Controller {
  constructor(@Inject(QUEUE_FACTORY_INJECT_TOKEN) private readonly _queueFactory: IQueueFactory) {
    super();
  }

  @HttpPost()
  async PostTest(@RequestBody() data: any) {
    const publisher = this._queueFactory.GetPublisher();
    await publisher.PublishAsync('test', {
      title: 'newbility-test',
      time: moment().toDate(),
    });

    await publisher.PublishAsync('zmsignal', {
      title: 'newbility-zmsignal',
      time: moment().toDate(),
    });

    return 1;
  }
}
