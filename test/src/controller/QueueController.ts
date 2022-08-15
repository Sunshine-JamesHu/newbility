// import { HttpPost } from '../../src/koa-core/src/router/Request';
// import { Controller } from '../../src/koa-core/src/controller/Controller';
// import { RequestBody } from '../../src/koa-core/src/router/RequestData';
// import { Router } from '../../src/koa-core/src/router/Router';
// import { Inject, Injectable, Transient } from '../../src/core/src/di/Dependency';
// import { IQueueFactory, QUEUE_FACTORY_INJECT_TOKEN } from '../../src/queue-core/src/QueueFactory';
// import moment from 'moment';

// @Injectable()
// @Transient()
// @Router({ desc: '管道测试' })
// export default class QueueController extends Controller {
//   constructor(@Inject(QUEUE_FACTORY_INJECT_TOKEN) private readonly _queueFactory: IQueueFactory) {
//     super();
//   }

//   @HttpPost()
//   async PostTest(@RequestBody() data: any) {
//     const publisher = this._queueFactory.GetPublisher();
//     await publisher.PublishAsync('test', {
//       title: 'newbility-test',
//       time: moment().toDate(),
//     });

//     await publisher.PublishAsync('zmsignal', {
//       title: 'newbility-zmsignal',
//       time: moment().toDate(),
//     });

//     return 1;
//   }
// }
