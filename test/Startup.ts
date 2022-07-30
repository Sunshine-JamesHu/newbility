import { DependsOn } from '../src/core/src/modularity/DependsOn';
import { KoaCoreModule } from '../src/koa-core/src/KoaCoreModule';
import { AppModule, ModulePath } from '../src/core/src/modularity/AppModule';
import { Inject, Injectable } from '../src/core/src/di/Dependency';
import { SwaggerModule } from '../src/swagger/src/SwaggerModule';
import { ISwaggerBuilder, SWAGGER_BUILDER_INJECT_TOKEN } from '../src/swagger/src/SwaggerBuilder';

@Injectable()
@ModulePath(__dirname)
@DependsOn(KoaCoreModule, SwaggerModule)
export class Startup extends AppModule {}
