import {
  ILogger,
  LOGGER_INJECT_TOKEN,
  Container,
  Metadata,
  GetMetadata,
  Abstract,
  GetMetadataKey,
  GetInjectToken,
  IServiceCollection,
  SC_INJECT_TOKEN,
} from '@newbility/core';

export const BACKGROUND_WORKER_METADATA = GetMetadataKey('Sys:IBackgroundWorker');
export const BACKGROUND_WORKER_INJECT_TOKEN = GetInjectToken('Sys:IBackgroundWorker');

export function IsBackgroundWorker(target: any) {
  return GetMetadata(BACKGROUND_WORKER_METADATA, target);
}

export function GetAllBackgroundWorkers() {
  const sc = Container.resolve<IServiceCollection>(SC_INJECT_TOKEN);
  const services = sc.GetServices();

  const controllers: any[] = [];
  services.forEach((element) => {
    if (IsBackgroundWorker(element)) controllers.push(element);
  });

  return controllers;
}

export interface IBackgroundWorker {
  DoWorkAsync(): Promise<void>;
}

@Metadata(BACKGROUND_WORKER_METADATA, true)
@Abstract()
export abstract class BackgroundWorker implements IBackgroundWorker {
  protected readonly Logger: ILogger;
  constructor() {
    this.Logger = Container.resolve<ILogger>(LOGGER_INJECT_TOKEN);
  }
  abstract DoWorkAsync(): Promise<void>;
}
