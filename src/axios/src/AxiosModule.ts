import { Injectable, AppModule, ModulePath, DependsOn } from '@newbility/core';
import { HttpClientCoreModule } from '@newbility/http-client-core';

@ModulePath(__dirname)
@Injectable()
@DependsOn(HttpClientCoreModule)
export class AxiosModule extends AppModule {}
