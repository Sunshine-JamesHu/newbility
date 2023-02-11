import { Injectable, AppModule, ModulePath, DependsOn } from '@newbility/core';
import { BackgroundWorkerModule } from '../background-worker-core/BackgroundWorkerModule';

@ModulePath(__dirname)
@Injectable()
@DependsOn(BackgroundWorkerModule)
export class CronBackgroundWorkerModule extends AppModule {}
