import { Injectable, AppModule, ModulePath, DependsOn, CoreModule } from '@newbility/core';

@ModulePath(__dirname)
@Injectable()
@DependsOn(CoreModule)
export class DatabaseModule extends AppModule {}
