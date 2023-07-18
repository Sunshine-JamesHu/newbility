import { Injectable, AppModule, ModulePath, DependsOn } from '@newbility/core';
import { KoaCoreModule } from '@newbility/koa-core';

@ModulePath(__dirname)
@Injectable()
@DependsOn(KoaCoreModule)
export class SwaggerModule extends AppModule {}
