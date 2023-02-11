import { BackgroundWorkerModule } from '@newbility/background-worker-core';
import { Injectable, AppModule, ModulePath, DependsOn } from '@newbility/core';

@ModulePath(__dirname)
@Injectable()
@DependsOn(BackgroundWorkerModule)
export class CronBackgroundWorkerModule extends AppModule {}
