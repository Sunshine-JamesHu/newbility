"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitGlobalError = void 0;
const core_1 = require("@newbility/core");
function InitGlobalError(app) {
    const logger = core_1.Container.resolve(core_1.LOGGER_INJECT_TOKEN);
    // 处理常规错误
    app.on('error', (err) => {
        logger.LogError('error', err);
    });
    // 处理用户自定义错误
    app.use(async (ctx, next) => {
        try {
            await next();
        }
        catch (error) {
            if (error instanceof core_1.UserFriendlyError) {
                ctx.status = error.status ?? 403;
                let errorData = { msg: error.message };
                if (error.data) {
                    errorData = { ...errorData, ...error.data };
                }
                ctx.body = errorData;
            }
            else {
                ctx.throw(500, error.message);
            }
        }
    });
}
exports.InitGlobalError = InitGlobalError;
//# sourceMappingURL=Error.js.map