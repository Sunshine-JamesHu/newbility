import { AppModule, ModulePath, Injectable, DependsOn } from '@newbility/core';
import { ConfigureOssOptions, OssCoreModule } from '@newbility/oss-core';
import { OSS_KEY } from './LocalOssConst';

@ModulePath(__dirname)
@Injectable()
@DependsOn(OssCoreModule)
export class LocalOssModule extends AppModule {
  public OnPreApplicationInitialization(): void {
    ConfigureOssOptions(OSS_KEY);
  }
}
