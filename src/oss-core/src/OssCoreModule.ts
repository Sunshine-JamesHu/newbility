import { AppModule, ModulePath } from '../../core/src/modularity/AppModule';
import { Injectable } from '../../core/src/di/Dependency';
import { ConfigureOssOptions } from './OssOptions';
import { OSS_KEY } from './local-oss/LocalOssConst';

@ModulePath(__dirname)
@Injectable()
export class OssCoreModule extends AppModule {
  public OnPreApplicationInitialization(): void {
    ConfigureOssOptions(OSS_KEY);
  }
}
