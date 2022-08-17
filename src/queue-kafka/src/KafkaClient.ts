import { Kafka, logLevel as LogLevel } from 'kafkajs';
import { QueueClient } from '@newbility/queue-core';
import { Abstract, ILogger } from '@newbility/core';
import { KafkaOptions } from './KafkaOptions';

@Abstract()
export abstract class KafkaClient<TClient> extends QueueClient<TClient> {
  private readonly _kafkaClient: Kafka;
  protected get Client() {
    return this._kafkaClient;
  }

  private readonly _options: KafkaOptions;
  protected get Options() {
    return this._options;
  }

  constructor(options: KafkaOptions) {
    super(`kafka_${options.key}`, options.disposeTime);
    this._kafkaClient = this.CreateKafkaClient(options);
    this._options = options;
  }

  protected CreateKafkaClient(options: KafkaOptions): Kafka {
    return new Kafka({
      ...options,
      logCreator: this.GetKafkaLogger(this.Logger),
    });
  }

  protected GetKafkaLogger(logger: ILogger) {
    return (logLevel: LogLevel) => {
      let levelLogger: (msg: string, ...args: any[]) => void = (msg: string, ...args: any[]) => {
        logger.LogDebug(msg, args);
      };
      if (logLevel === LogLevel.INFO) {
        levelLogger = (msg: string, ...args: any[]) => {
          logger.LogInfo(msg, args);
        };
      } else if (logLevel === LogLevel.WARN) {
        levelLogger = (msg: string, ...args: any[]) => {
          logger.LogWarn(msg, args);
        };
      } else if (logLevel === LogLevel.ERROR) {
        levelLogger = (msg: string, ...args: any[]) => {
          logger.LogError(msg, args);
        };
      }

      return ({ namespace, level, label, log }: any) => {
        const { message, ...extra } = log;
        levelLogger(message, log);
      };
    };
  }
}
