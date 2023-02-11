import { GetMetadataKey } from '@newbility/core';

const BACKGROUND_WORKER_METADATA = GetMetadataKey('Sys:BackgroundWorkerScheduler');

export type SchedulerInfo = {
  cron: string;
  timeZone?: string;
};

export function Scheduler(info: SchedulerInfo) {
  return (target: Function) => {
    if (!info.timeZone) {
      info.timeZone = 'Asia/Shanghai'; // 默认上海
    }
    Reflect.defineMetadata(BACKGROUND_WORKER_METADATA, info, target);
  };
}

export function GetSchedulerInfo(target: Function): SchedulerInfo | undefined {
  return Reflect.getMetadata(BACKGROUND_WORKER_METADATA, target);
}
