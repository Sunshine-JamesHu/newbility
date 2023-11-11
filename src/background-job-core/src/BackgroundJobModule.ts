import { Injectable, AppModule, ModulePath, DependsOn, CoreModule, Container } from '@newbility/core';

@ModulePath(__dirname)
@Injectable()
@DependsOn(CoreModule)
export class BackgroundJobModule extends AppModule {}
