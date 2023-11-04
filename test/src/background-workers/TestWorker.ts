import { Singleton } from '@newbility/core';
import { BackgroundWorker } from '@newbility/background-worker-core';
import { Scheduler } from '@newbility/background-worker-core';

@Scheduler({ cron: '0/5 * * * * *' })
@Singleton()
export class TestCronJob extends BackgroundWorker {
  DoWorkAsync(): Promise<void> {
    this.Logger.LogDebug('我是每5秒执行一次的任务');
    return Promise.resolve();
  }
}

@Scheduler({ cron: '0/10 * * * * *' })
@Singleton()
export class TestCronJob2 extends BackgroundWorker {
  DoWorkAsync(): Promise<void> {
    this.Logger.LogDebug('我是每10秒执行一次的任务');
    return Promise.resolve();
  }
}
