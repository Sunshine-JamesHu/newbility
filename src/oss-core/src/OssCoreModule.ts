import { AppModule, ModulePath } from '../../core/src/modularity/AppModule';
import { Injectable } from '../../core/src/di/Dependency';
import { DependsOn } from '../../core/src/modularity/DependsOn';
import { CoreModule } from '../../core/src/CoreModule';

@ModulePath(__dirname)
@Injectable()
@DependsOn(CoreModule)
export class OssCoreModule extends AppModule {}
