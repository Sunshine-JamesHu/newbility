import cron, { CronJob } from 'cron';
import { Singleton, NewbilityError, Container } from '@newbility/core';
import {
  BackgroundWorkerManager,
  BACKGROUND_WORKER_MANAGER_INJECT_TOKEN,
  GetSchedulerInfo,
  IBackgroundWorker,
} from '@newbility/background-worker-core';

@Singleton(BACKGROUND_WORKER_MANAGER_INJECT_TOKEN)
export class CronBackgroundWorkerManager extends BackgroundWorkerManager {
  protected readonly StartedWorker: CronJob[] = [];

  StartAsync(): Promise<void> {
    for (let index = 0; index < this.AllWorker.length; index++) {
      const element = this.AllWorker[index];
      const workerJob = this.GenWorker(element);
      workerJob.start();
      this.StartedWorker.push(workerJob);
    }
    return Promise.resolve();
  }

  StopAsync(): Promise<void> {
    this.Logger.LogDebug('停止所有BackgroundWorker');
    this.StartedWorker.forEach((worker) => {
      worker.stop();
    });
    return Promise.resolve();
  }

  protected GenWorker(worker: Function): cron.CronJob {
    const schedulerInfo = GetSchedulerInfo(worker);
    if (!schedulerInfo || !schedulerInfo.cron) {
      throw new NewbilityError('CronInfo is not null or empty');
    }
    const cronWorker = new cron.CronJob(
      schedulerInfo.cron,
      async () => {
        const workerIns = Container.resolve<IBackgroundWorker>(worker as any);
        await workerIns.DoWorkAsync();
      },
      null,
      false,
      schedulerInfo.timeZone ?? 'Asia/Shanghai'
    );
    return cronWorker;
  }
}
