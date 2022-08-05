import { ISettingManager, SETTING_INJECT_TOKEN } from '../../core/src/setting/SettingManager';
import { AppModule } from '../../core/src/modularity/AppModule';
import { QueueOptions, QueueSetting } from './QueueOptions';
import { Abstract, Container } from '../../core/src/di/Dependency';
import { GetQueueInjectToken, QueueSubType } from './Queue';
import { ISubscriber } from './subscriber/Subscriber';
import { ILogger, LOGGER_INJECT_TOKEN } from '../../core/src/logger/Logger';

@Abstract()
export abstract class QueueModule extends AppModule {
  private readonly _logger: ILogger;
  private readonly _settings: ISettingManager;
  private readonly _queueType: string;
  constructor(queueType: string) {
    super();
    this._queueType = queueType;
    this._settings = Container.resolve<ISettingManager>(SETTING_INJECT_TOKEN);
    this._logger = Container.resolve<ILogger>(LOGGER_INJECT_TOKEN);
  }

  public OnPreApplicationInitialization(): void {
    this.InitQueue();
  }

  public OnPostApplicationInitialization(): void {
    // await this.StartSubscriber();
    // 放进后台进行启动,不占用主线程
    this.StartSubscriber().then(
      () => {
        this._logger.LogDebug('Queue started');
      },
      (err) => {
        this._logger.LogError('Queue start error', err);
      }
    );
  }

  protected InitQueue() {
    const queueSettings = this._settings.GetConfig<QueueSetting>('queues');
    if (!queueSettings) return;
    const queueKeys = Object.getOwnPropertyNames(queueSettings);
    if (!queueKeys || !queueKeys.length) return;

    queueKeys.forEach((key) => {
      const queueSetting: QueueOptions = queueSettings[key];
      if (queueSetting && queueSetting.type === this._queueType) {
        this.RegisterQueue(key, queueSetting.options);
      }
    });
  }

  protected async StartSubscriber(): Promise<void> {
    const queueSettings = this._settings.GetConfig<QueueSetting>('queues');
    if (!queueSettings) return;
    const queueKeys = Object.getOwnPropertyNames(queueSettings);
    if (!queueKeys || !queueKeys.length) return;

    for (let index = 0; index < queueKeys.length; index++) {
      const key = queueKeys[index];
      const queueSetting: QueueOptions = queueSettings[key];
      if (queueSetting && queueSetting.type === this._queueType) {
        const token = GetQueueInjectToken(key, QueueSubType.Subscriber);
        if (Container.isRegistered(token)) {
          const queue = Container.resolve<ISubscriber>(token);
          await queue.StartAsync();
        }
      }
    }
  }

  protected abstract RegisterQueue(key: string, options: any): void;
}
