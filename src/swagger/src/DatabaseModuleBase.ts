import { Container, AppModule, Abstract, DependsOn, ISettingManager, SETTING_INJECT_TOKEN } from '@newbility/core';
import { DatabaseModule } from './DatabaseModule';
import { DatabaseOptionsBase, DatabaseSetting, DatabaseType } from './DatabaseOptions';
import { GetDatabaseProviderToken, IDatabaseProvider } from './DatabaseProvider';

@Abstract()
@DependsOn(DatabaseModule)
export abstract class DatabaseModuleBase extends AppModule {
  protected readonly SettingManager: ISettingManager;
  protected readonly DbType: DatabaseType;

  constructor(dbType: DatabaseType) {
    super();
    this.SettingManager = Container.resolve<ISettingManager>(SETTING_INJECT_TOKEN);
    this.DbType = dbType;
  }

  override OnPreApplicationInitialization(): void {
    const dbSettings = this.SettingManager.GetConfig<DatabaseSetting>('databases');
    if (dbSettings) {
      for (const key in dbSettings) {
        if (Object.prototype.hasOwnProperty.call(dbSettings, key)) {
          const dbOptions = dbSettings[key];
          if (dbOptions.type === this.DbType) {
            this.RegisterDbProvider(key, dbOptions.options);
          }
        }
      }
    }
  }

  protected RegisterDbProvider(dbKey: string, options: DatabaseOptionsBase): void {
    const ProviderType = this.GetDbProvider(dbKey);
    const dbToken = GetDatabaseProviderToken(dbKey);

    // 由于需要不同的配置文件作为参数，所以这里不能使用单例模式去注入,而是直接使用new的方式去创建
    Container.registerInstance<IDatabaseProvider>(dbToken, new ProviderType(options));
  }

  protected abstract GetDbProvider(key: string): any;
}
