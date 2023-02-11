import { Injectable, AppModule, ModulePath, DependsOn, CoreModule, Container } from '@newbility/core';
import { BACKGROUND_WORKER_MANAGER_INJECT_TOKEN, IBackgroundWorkerManager } from './BackgroundWorkerManager';

@ModulePath(__dirname)
@Injectable()
@DependsOn(CoreModule)
export class BackgroundWorkerModule extends AppModule {
  async OnApplicationInitialization(): Promise<void> {
    const workerManager = Container.resolve<IBackgroundWorkerManager>(BACKGROUND_WORKER_MANAGER_INJECT_TOKEN);
    await workerManager.StartAsync();
  }

  async OnApplicationShutdown(): Promise<void> {
    const workerManager = Container.resolve<IBackgroundWorkerManager>(BACKGROUND_WORKER_MANAGER_INJECT_TOKEN);
    await workerManager.StopAsync();
  }
}
