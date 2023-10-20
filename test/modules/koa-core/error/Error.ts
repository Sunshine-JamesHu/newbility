import Koa from 'koa';
import { ILogger, LOGGER_INJECT_TOKEN, Container } from '@newbility/core';

export function InitGlobalError(app: Koa) {
  const logger = Container.resolve<ILogger>(LOGGER_INJECT_TOKEN);
  app.on('error', (err: Error) => {
    logger.LogError('error', err);
  });
}
