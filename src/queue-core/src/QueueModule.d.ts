import { AppModule } from '../../core/src/modularity/AppModule';
export declare abstract class QueueModule extends AppModule {
    private readonly _logger;
    private readonly _settings;
    private readonly _queueType;
    constructor(queueType: string);
    OnPreApplicationInitialization(): void;
    OnPostApplicationInitialization(): void;
    protected InitQueue(): void;
    protected StartSubscriber(): Promise<void>;
    protected abstract RegisterQueue(key: string, options: any): void;
}
