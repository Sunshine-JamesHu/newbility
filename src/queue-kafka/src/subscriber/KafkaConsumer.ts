import { Consumer } from 'kafkajs';
import { NewbilityError } from '../../../core/src/error/NewbilityError';
import { KafkaClient } from '../KafkaClient';
import { KafkaOptions } from '../KafkaOptions';

export class KafkaConsumer extends KafkaClient<Consumer> {
  constructor(options: KafkaOptions) {
    super({
      ...options,
      disposeTime: -1, // 消费者必须为-1
      key: `${options.key}_consumer`,
    });
  }

  async DisconnectClient(c: Consumer): Promise<void> {
    await c.disconnect();
  }

  async CreateClient(): Promise<Consumer> {
    if (!this.Options.clientId) throw new NewbilityError('Must be have [clientId]');

    const consumer = this.Client.consumer({ groupId: this.Options.clientId });
    await consumer.connect();
    return consumer;
  }
}
