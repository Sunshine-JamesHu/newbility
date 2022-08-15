import AsyncLock from 'async-lock';
import { IAsyncDisposable } from '../../core/src/sys/Disposable';
import { ILogger } from '../../core/src/logger/Logger';
export interface IQueueClient<TClient> extends IAsyncDisposable {
    GetClient(): Promise<TClient>;
}
export declare abstract class QueueClient<TClient> implements IQueueClient<TClient> {
    private readonly _key;
    private readonly _disposeTime;
    private readonly _lock;
    private readonly _logger;
    protected get Logger(): ILogger;
    private clientTimer;
    private client;
    constructor(key: string, disposeTime?: number);
    GetClient(): Promise<TClient>;
    DisposeAsync(): Promise<void>;
    abstract DisconnectClient(c: TClient): Promise<void>;
    protected abstract CreateClient(): Promise<TClient>;
    protected GetAsyncLock(): AsyncLock;
    protected GetDisposeTime(disposeTime?: number): number;
    protected StartOrReBuildTimer(): void;
}
