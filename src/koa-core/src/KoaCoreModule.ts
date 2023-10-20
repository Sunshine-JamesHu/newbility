import { Inject, Injectable, AppModule, ModulePath, DependsOn, CoreModule } from '@newbility/core';
import { IControllerBuilder, CTL_BUILDER_INJECT_TOKEN } from './controller/ControllerBuilder';
import { IMiddlewareInitializer, MIDDLEWARE_INIT_INJECT_TOKEN } from './middleware/MiddlewareInitializer';

@Injectable()
@DependsOn(CoreModule)
@ModulePath(__dirname)
export class KoaCoreModule extends AppModule {
  private readonly _ctlBuilder: IControllerBuilder;
  private readonly _middlewareInitializer: IMiddlewareInitializer;
  constructor(
    @Inject(CTL_BUILDER_INJECT_TOKEN) ctlBuilder: IControllerBuilder,
    @Inject(MIDDLEWARE_INIT_INJECT_TOKEN) middlewareInitializer: IMiddlewareInitializer
  ) {
    super();
    this._ctlBuilder = ctlBuilder;
    this._middlewareInitializer = middlewareInitializer;
  }

  public OnApplicationInitialization(): void {
    this._middlewareInitializer.InitMiddleware();
    this._ctlBuilder.CreateControllers(); // 创建Controller
  }
}
