import Koa, { Context, Next } from 'koa';
import { container } from 'tsyringe';
import { ILogger, LOGGER_INJECT_TOKEN } from '../../../core/src/logger/Logger';
import { UserFriendlyError } from '../../../core/src/error/UserFriendlyError';

export function InitGlobalError(app: Koa) {
  const logger = container.resolve<ILogger>(LOGGER_INJECT_TOKEN);

  // 处理常规错误
  app.on('error', (err: Error) => {
    logger.LogError('error', err);
  });

  // 处理用户自定义错误
  app.use(async (ctx: Context, next: Next) => {
    try {
      await next();
    } catch (error: any) {
      if (error instanceof UserFriendlyError) {
        ctx.status = error.status ?? 403;
        let errorData = { msg: error.message };
        if (error.data) {
          errorData = { ...errorData, ...error.data };
        }
        ctx.body = errorData;
      } else {
        ctx.throw(500, error.message);
      }
    }
  });
}
