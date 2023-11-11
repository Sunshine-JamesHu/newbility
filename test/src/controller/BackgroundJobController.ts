import { HttpPost, Controller, RequestBody, Router } from '@newbility/koa-core';
import { Inject, Injectable, Transient } from '@newbility/core';
import { BACKGROUND_JOB_MANAGER_INJECT_TOKEN, IBackgroundJobManager } from '@newbility/background-job-core';

@Injectable()
@Transient()
@Router({ desc: '后台Job测试' })
export default class BackgroundJobController extends Controller {
  constructor(@Inject(BACKGROUND_JOB_MANAGER_INJECT_TOKEN) private readonly _jobManager: IBackgroundJobManager) {
    super();
  }

  @HttpPost()
  JobTest(@RequestBody() data: any) {
    this._jobManager.AddJob(async () => {
      await new Promise<void>((res, rej) => {
        this.Logger.LogDebug('后台任务作业中~', data);
        setTimeout(() => {
          try {
            this.Logger.LogDebug('后台任务执行完毕~');
            res();
          } catch (error) {
            rej(error);
          }
        }, 5000);
      });
    });
  }
}
