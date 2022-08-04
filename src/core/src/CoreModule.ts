import { Inject, Injectable } from './di/Dependency';
import { IServiceCollection, SC_INJECT_TOKEN } from './di/ServiceCollection';
import { EVENT_BUS_INJECT_TOKEN, IEventBus } from './event/EventBus';
import { GetEventKey } from './event/EventHandler';
import { AppModule, ModulePath } from './modularity/AppModule';

@ModulePath(__dirname)
@Injectable()
export class CoreModule extends AppModule {
  private readonly _eventBus: IEventBus;
  private readonly _services: IServiceCollection;
  constructor(@Inject(SC_INJECT_TOKEN) services: IServiceCollection, @Inject(EVENT_BUS_INJECT_TOKEN) eventBus: IEventBus) {
    super();
    this._services = services;
    this._eventBus = eventBus;
  }
  public OnPreApplicationInitialization(): void {
    this.InitEventHandlers();
  }

  private InitEventHandlers() {
    const svcs = this._services.GetServices();
    svcs.forEach((svc) => {
      const eventKey = GetEventKey(svc);
      if (eventKey) {
        this._eventBus.Subscribe(eventKey, svc);
      }
    });
  }
}
