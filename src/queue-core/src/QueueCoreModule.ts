import { AppModule, ModulePath, Injectable, DependsOn, CoreModule } from '@newbility/core';

@ModulePath(__dirname)
@Injectable()
@DependsOn(CoreModule)
export class QueueCoreModule extends AppModule {}
