import { Injectable, AppModule, ModulePath, DependsOn } from '@newbility/core';
import { KoaCoreModule } from '../koa-core/KoaCoreModule';

@ModulePath(__dirname)
@Injectable()
@DependsOn(KoaCoreModule)
export class KoaJwtModule extends AppModule {

}


