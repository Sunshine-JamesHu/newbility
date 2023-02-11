import { Abstract, IRunnable, GetInjectToken, Container, ILogger, LOGGER_INJECT_TOKEN } from '@newbility/core';
import { GetAllBackgroundWorkers } from './BackgroundWorker';

export const BACKGROUND_WORKER_MANAGER_INJECT_TOKEN = GetInjectToken('Sys:IBackgroundWorkerManager');

export interface IBackgroundWorkerManager extends IRunnable {}

@Abstract()
export abstract class BackgroundWorkerManager implements IBackgroundWorkerManager {
  protected readonly Logger: ILogger;
  protected readonly AllWorker: Function[];
  constructor() {
    this.AllWorker = GetAllBackgroundWorkers();
    this.Logger = Container.resolve<ILogger>(LOGGER_INJECT_TOKEN);
  }

  abstract StartAsync(): Promise<void>;
  abstract StopAsync(): Promise<void>;
}
