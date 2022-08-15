import { OssCoreModule, ConfigureOssOptions } from '@newbility/oss-core';
import { DependsOn, AppModule, ModulePath, Injectable } from '@newbility/core';
import { OSS_KEY } from './MinioConst';

@Injectable()
@ModulePath(__dirname)
@DependsOn(OssCoreModule)
export class MinioModule extends AppModule {
  public OnPreApplicationInitialization(): void | Promise<void> {
    ConfigureOssOptions(OSS_KEY);
  }
}
