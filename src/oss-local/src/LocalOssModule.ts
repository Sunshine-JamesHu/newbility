import { AppModule, ModulePath } from '../../core/src/modularity/AppModule';
import { Injectable } from '../../core/src/di/Dependency';
import { DependsOn } from '../../core/src/modularity/DependsOn';
import { ConfigureOssOptions } from '../../oss-core/src/OssOptions';
import { OssCoreModule } from '../../oss-core/src/OssCoreModule';
import { OSS_KEY } from './LocalOssConst';

@ModulePath(__dirname)
@Injectable()
@DependsOn(OssCoreModule)
export class LocalOssModule extends AppModule {
  public OnPreApplicationInitialization(): void {
    ConfigureOssOptions(OSS_KEY);
  }
}
