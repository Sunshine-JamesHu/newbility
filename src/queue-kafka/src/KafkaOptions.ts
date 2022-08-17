import { KafkaConfig } from 'kafkajs';

export interface KafkaOptions extends KafkaConfig {
  key: string;
  disposeTime?: number;
}
