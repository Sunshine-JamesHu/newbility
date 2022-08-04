import { Consumer } from 'kafkajs';
import { IQueueClient } from '../../../queue-core/src/QueueClient';
import { KafkaOptions } from '../KafkaOptions';
import { KafkaConsumer } from './KafkaConsumer';
import { Injectable } from '../../../core/src/di/Dependency';
import { Subscriber } from '../../../queue-core/src/subscriber/Subscriber';

@Injectable()
export class KafkaSubscriber extends Subscriber {
  private readonly _queueClient: IQueueClient<Consumer>;
  constructor(options: KafkaOptions) {
    super();
    this._queueClient = this.GetQueueClient(options);
  }

  async StartQueueAsync(): Promise<void> {
    // const subTopics = this.HandlerMap.keys();
    // const subTopicCount = this.HandlerMap.size;
    const consumer = await this._queueClient.GetClient();

    for (let x of this.HandlerMap) {
      const topic = x[0];
      await consumer.subscribe({ topic: topic, fromBeginning: true });
    }

    // for (let index = 0; index < subTopicCount; index++) {
    //   const topic = subTopics[index];
    //   await consumer.subscribe({ topic: topic, fromBeginning: true });
    // }

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        this.OnMessage({ topic: topic, value: message.value });
      },
    });
  }

  protected GetQueueClient(options: KafkaOptions): IQueueClient<Consumer> {
    return new KafkaConsumer(options);
  }

  protected OnMessage(message: any) {
    const eventKeys = this.HandlerMap.get(message.topic);
    if (eventKeys) {
      eventKeys.forEach((eventKey) => {
        if (eventKey) {
          this.EmitEvent(eventKey, {
            ext: {
              topic: message.topic,
            },
            data: message.value,
          });
        }
      });
    }
  }
}
