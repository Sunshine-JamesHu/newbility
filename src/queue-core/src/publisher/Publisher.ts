import { ILogger, LOGGER_INJECT_TOKEN } from '../../../core/src/logger/Logger';
import { Abstract, Container } from '../../../core/src/di/Dependency';

export interface IPublisher {
  /**
   * 发布
   * @param topic 主题
   * @param data 数据
   */
  PublishAsync(topic: string, data: any): Promise<void>;

  /**
   * 批量发布
   * @param topic 主题
   * @param data 数据
   */
  BatchPublishAsync(topic: string, data: any[]): Promise<void>;
}

@Abstract()
export abstract class Publisher implements IPublisher {
  private readonly _logger: ILogger;
  constructor() {
    this._logger = Container.resolve<ILogger>(LOGGER_INJECT_TOKEN);
  }
  abstract PublishAsync(topic: string, data: any): Promise<void>;

  abstract BatchPublishAsync(topic: string, data: any[]): Promise<void>;

  protected get Logger() {
    return this._logger;
  }
}
