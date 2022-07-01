import { Container } from '../../../core/src/di/Dependency';
import { ILogger, LOGGER_INJECT_TOKEN } from '../../../core/src/logger/Logger';

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
