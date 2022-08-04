import { Partitioners, Producer } from 'kafkajs';
import { KafkaClient } from '../KafkaClient';
import { KafkaOptions } from '../KafkaOptions';

export class KafkaProducer extends KafkaClient<Producer> {
  constructor(options: KafkaOptions) {
    super({
      ...options,
      key: `${options.key}_producer`,
    });
  }

  async DisconnectClient(c: Producer): Promise<void> {
    await c.disconnect();
  }

  async CreateClient(): Promise<Producer> {
    const producer = this.Client.producer({ createPartitioner: Partitioners.DefaultPartitioner });
    await producer.connect();
    return producer;
  }
}
