import { Injectable, AppModule, ModulePath, DependsOn } from '@newbility/core';
import { HttpClientCoreModule } from '../http-client-core/HttpClientCoreModule';

@ModulePath(__dirname)
@Injectable()
@DependsOn(HttpClientCoreModule)
export class AxiosModule extends AppModule {}
