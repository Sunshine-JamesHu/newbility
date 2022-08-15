import { ILogger } from '../../../core/src/logger/Logger';
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
export declare abstract class Publisher implements IPublisher {
    private readonly _logger;
    constructor();
    abstract PublishAsync(topic: string, data: any): Promise<void>;
    abstract BatchPublishAsync(topic: string, data: any[]): Promise<void>;
    protected get Logger(): ILogger;
}
