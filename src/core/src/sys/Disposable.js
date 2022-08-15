"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsingAsync = void 0;
async function UsingAsync(ins, func) {
    let result = undefined;
    try {
        if (func) {
            const fnRes = func();
            if (fnRes instanceof Promise) {
                result = await fnRes;
            }
        }
    }
    catch (error) {
        throw error;
    }
    finally {
        // 主函数执行错误也要执行Dispose,防止堆栈溢出
        if (ins) {
            if (ins['DisposeAsync']) {
                await ins.DisposeAsync();
            }
            else {
                ins.Dispose();
            }
        }
    }
    return result;
}
exports.UsingAsync = UsingAsync;
//# sourceMappingURL=Disposable.js.map