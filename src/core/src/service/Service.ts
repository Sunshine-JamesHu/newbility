import { Container } from '../di/Dependency';
import { ILogger, LOGGER_INJECT_TOKEN } from '../logger/Logger';

export interface IService {}

export abstract class Service implements IService {
  private readonly _logger: ILogger;

  constructor() {
    this._logger = Container.resolve<ILogger>(LOGGER_INJECT_TOKEN);
  }

  protected get Logger() {
    return this._logger;
  }
}
