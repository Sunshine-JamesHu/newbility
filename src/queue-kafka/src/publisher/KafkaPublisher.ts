import { Producer } from 'kafkajs';
import { IQueueClient, Publisher } from '@newbility/queue-core';
import { Injectable } from '@newbility/core';
import { KafkaOptions } from '../KafkaOptions';
import { KafkaProducer } from './KafkaProducer';

@Injectable()
export class KafkaPublisher extends Publisher {
  private readonly _queueClient: IQueueClient<Producer>;
  constructor(options: KafkaOptions) {
    super();
    this._queueClient = this.GetQueueClient(options);
  }

  async PublishAsync(topic: string, data: any): Promise<void> {
    if (!topic) throw new Error('topic is not null or empry');
    if (!data) return;

    const isBuffer = data instanceof Buffer;
    if (!isBuffer) {
      if (Array.isArray(data) || typeof data === 'object') {
        data = JSON.stringify(data);
      }
    }
    const producer = await this._queueClient.GetClient();
    await producer.send({
      topic: topic,
      messages: [{ value: data }],
    });
  }

  BatchPublishAsync(topic: string, data: any[]): Promise<void> {
    throw new Error('Method not implemented.');
  }

  protected GetQueueClient(options: KafkaOptions): IQueueClient<Producer> {
    return new KafkaProducer(options);
  }
}
