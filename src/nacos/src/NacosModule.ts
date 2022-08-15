import { DependsOn, AppModule, ModulePath, Injectable, CoreModule } from '@newbility/core';

@Injectable()
@ModulePath(__dirname)
@DependsOn(CoreModule)
export class NacosModule extends AppModule {
  public OnPreApplicationInitialization(): void  {
    
  }
}
