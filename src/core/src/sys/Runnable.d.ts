export interface IRunnable {
    StartAsync(): Promise<void>;
    StopAsync(): Promise<void>;
}
