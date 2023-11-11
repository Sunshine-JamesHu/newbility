import { GetInjectToken, Guid, ILogger, Inject, Injectable, LOGGER_INJECT_TOKEN, PromiseHelper, Singleton } from '@newbility/core';

export const BACKGROUND_JOB_MANAGER_INJECT_TOKEN = GetInjectToken('Sys:BackgroundWorkerManager');

export interface IBackgroundJobManager {
  AddJob(callback: () => void | Promise<void>): string;
}

@Injectable()
@Singleton(BACKGROUND_JOB_MANAGER_INJECT_TOKEN)
export class BackgroundJobManager implements IBackgroundJobManager {
  protected readonly Logger: ILogger;
  constructor(@Inject(LOGGER_INJECT_TOKEN) logger: ILogger) {
    this.Logger = logger;
  }

  AddJob(callback: () => void | Promise<void>): string {
    const jobId = Guid.Create();

    // 推迟到下一个事件循环中执行
    process.nextTick(async () => {
      this.Logger.LogDebug(`[${jobId}]后台任务开始执行`);
      try {
        const task = callback();
        if (PromiseHelper.IsPromise(task)) {
          await task;
        }
        this.Logger.LogDebug(`[${jobId}]后台任务执行完成`);
      } catch (error) {
        this.Logger.LogError(`[${jobId}]后台任务执行失败`, error);
      }
    });

    return jobId;
  }
}
