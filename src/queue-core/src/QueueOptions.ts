export interface QueueOptions {
  type: string;
  options: any;
}

export interface QueueSetting {
  [key: string]: QueueOptions;
}
