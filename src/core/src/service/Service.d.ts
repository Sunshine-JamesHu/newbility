import { ILogger } from '../logger/Logger';
export interface IService {
}
export declare abstract class Service implements IService {
    private readonly _logger;
    constructor();
    protected get Logger(): ILogger;
}
