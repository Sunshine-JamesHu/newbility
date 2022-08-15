"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddCors = void 0;
const koa2_cors_1 = __importDefault(require("koa2-cors"));
function AddCors(app, options) {
    app.use((0, koa2_cors_1.default)(options));
}
exports.AddCors = AddCors;
//# sourceMappingURL=Cors.js.map