import Koa from 'koa';
import { DependsOn } from '../src/core/src/modularity/DependsOn';
import { KoaCoreModule } from '../src/koa-core/src/KoaCoreModule';
import { AppModule, ModulePath } from '../src/core/src/modularity/AppModule';
import { Inject, GetInjectToken, Injectable } from '../src/core/src/di/Dependency';
import { IControllerBuilder, CTL_BUILDER_INJECT_TOKEN } from '../src/koa-core/src/controller/ControllerBuilder';
import { SwaggerModule } from '../src/swagger/src/SwaggerModule';

@Injectable()
@ModulePath(__dirname)
@DependsOn(KoaCoreModule, SwaggerModule)
export class Startup extends AppModule {
  private readonly _app: Koa;
  private readonly _ctlBuilder: IControllerBuilder;
  constructor(@Inject(GetInjectToken('Sys:App')) app: Koa, @Inject(CTL_BUILDER_INJECT_TOKEN) ctlBuilder: IControllerBuilder) {
    super();
    this._ctlBuilder = ctlBuilder;
    this._app = app;
  }

  public OnApplicationInitialization(): void | Promise<void> {
    this._ctlBuilder.CreateControllerByModule(this._app, __dirname);
  }
}
