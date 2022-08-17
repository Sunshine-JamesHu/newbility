import AsyncLock from 'async-lock';
import { IAsyncDisposable, ILogger, LOGGER_INJECT_TOKEN, Abstract, Container } from '@newbility/core';

export interface IQueueClient<TClient> extends IAsyncDisposable {
  GetClient(): Promise<TClient>;
}

@Abstract()
export abstract class QueueClient<TClient> implements IQueueClient<TClient> {
  private readonly _key: string;
  private readonly _disposeTime: number;
  private readonly _lock: AsyncLock;
  private readonly _logger: ILogger;

  protected get Logger() {
    return this._logger;
  }

  private clientTimer: NodeJS.Timeout | undefined;
  private client: TClient | undefined;

  constructor(key: string, disposeTime?: number) {
    this._key = key;
    this._logger = Container.resolve<ILogger>(LOGGER_INJECT_TOKEN);
    this._disposeTime = this.GetDisposeTime(disposeTime);
    this._lock = this.GetAsyncLock();
  }

  async GetClient(): Promise<TClient> {
    // 如果有
    if (this._disposeTime > 0) {
      this.StartOrReBuildTimer();
    }

    if (this.client) return this.client;

    return await new Promise((resolve, reject) => {
      const localKey = `get_client_${this._key}`;
      this._lock.acquire<TClient>(
        localKey,
        async (done) => {
          if (this.client) {
            done(undefined, this.client);
          } else {
            try {
              this.Logger.LogDebug(`开始连接${this._key}`);
              const client = await this.CreateClient();
              this.Logger.LogDebug(`${this._key}连接成功`);
              done(undefined, client);
            } catch (error: any) {
              done(error);
            }
          }
        },
        (err, client) => {
          if (err) {
            this.Logger.LogError(`Get [${this._key}] client error`, err);
            reject(err);
          } else if (client) {
            if (this.client != client) {
              this.client = client;
            }
            resolve(client);
          } else {
            reject();
          }
        }
      );
    });
  }

  async DisposeAsync(): Promise<void> {
    if (this.client) {
      await this.DisconnectClient(this.client);
      this.client = undefined;
    }
  }

  abstract DisconnectClient(c: TClient): Promise<void>;

  protected abstract CreateClient(): Promise<TClient>;

  protected GetAsyncLock(): AsyncLock {
    return new AsyncLock({ timeout: 3000, maxPending: 2000 });
  }

  protected GetDisposeTime(disposeTime?: number) {
    if (!disposeTime) disposeTime = 1000 * 30; // 默认30秒
    return disposeTime;
  }

  protected StartOrReBuildTimer() {
    if (this.clientTimer) clearTimeout(this.clientTimer);
    this.clientTimer = setTimeout(async () => {
      if (this.clientTimer) {
        this.Logger.LogDebug(`${this._key}客户端长时间无操作,开始断开客户端`);
        await this.DisposeAsync();
        this.Logger.LogDebug(`${this._key}客户端已经成功断开`);
      }
    }, this._disposeTime);
  }
}
