import Koa from 'koa';
import { DependsOn } from '../../core/src/modularity/DependsOn';
import { AppModule, ModulePath } from '../../core/src/modularity/AppModule';
import { KoaCoreModule } from '../../koa-core/src/KoaCoreModule';
import { GetInjectToken, Inject, Injectable } from '../../core/src/di/Dependency';
import { ISwaggerBuilder, INJECT_TOKEN } from './SwaggerBuilder';

@ModulePath(__dirname)
@DependsOn(KoaCoreModule)
@Injectable()
export class SwaggerModule extends AppModule {
  private readonly _app: Koa;
  private readonly _swaggerBuilder: ISwaggerBuilder;
  constructor(@Inject(GetInjectToken('Sys:App')) app: Koa, @Inject(INJECT_TOKEN) swaggerBuilder: ISwaggerBuilder) {
    super();
    this._app = app;
    this._swaggerBuilder = swaggerBuilder;
  }
  public OnPostApplicationInitialization(): void {
    this._swaggerBuilder.CreateSwaggerApi(this._app);
  }
}
