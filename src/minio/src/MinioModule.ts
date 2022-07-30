import { DependsOn } from '../../core/src/modularity/DependsOn';
import { AppModule, ModulePath } from '../../core/src/modularity/AppModule';
import { Injectable } from '../../core/src/di/Dependency';
import { OssCoreModule } from '../../oss-core/src/OssCoreModule';
import { ConfigureOssOptions } from '../../oss-core/src/OssOptions';

@Injectable()
@ModulePath(__dirname)
@DependsOn(OssCoreModule)
export class MinioModule extends AppModule {
  public OnPreApplicationInitialization(): void | Promise<void> {
    ConfigureOssOptions('minio');
  }
}
