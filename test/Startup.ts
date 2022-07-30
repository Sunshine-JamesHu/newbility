import { DependsOn } from '../src/core/src/modularity/DependsOn';
import { KoaCoreModule } from '../src/koa-core/src/KoaCoreModule';
import { AppModule, ModulePath } from '../src/core/src/modularity/AppModule';
import { Injectable } from '../src/core/src/di/Dependency';
import { SwaggerModule } from '../src/swagger/src/SwaggerModule';
import { OssCoreModule } from '../src/oss-core/src/OssCoreModule';
import { UseOssProvider } from '../src/oss-core/src/OssProvider';
import { LocalOssModule } from '../src/oss-local/src/LocalOssModule';
import { OSS_KEY as LOCAL_OSS_KEY } from '../src/oss-local/src/LocalOssConst';
import { MinioModule } from '../src/minio/src/MinioModule';
import { OSS_KEY as MINIO_OSS_KEY } from '../src/minio/src/MinioConst';

@Injectable()
@ModulePath(__dirname)
@DependsOn(KoaCoreModule, SwaggerModule, OssCoreModule, LocalOssModule, MinioModule)
export class Startup extends AppModule {
  public OnApplicationInitialization(): void {
    // UseOssProvider(LOCAL_OSS_KEY); // 使用本地存储作为默认存储
    UseOssProvider(MINIO_OSS_KEY); // 使用Minio作做为默认存储
  }
}
