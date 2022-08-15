import { IServiceCollection } from './di/ServiceCollection';
import { IEventBus } from './event/EventBus';
import { AppModule } from './modularity/AppModule';
export declare class CoreModule extends AppModule {
    private readonly _eventBus;
    private readonly _services;
    constructor(services: IServiceCollection, eventBus: IEventBus);
    OnPreApplicationInitialization(): void;
    private InitEventHandlers;
}
