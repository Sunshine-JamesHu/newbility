"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Service = void 0;
const Dependency_1 = require("../di/Dependency");
const Logger_1 = require("../logger/Logger");
class Service {
    constructor() {
        this._logger = Dependency_1.Container.resolve(Logger_1.LOGGER_INJECT_TOKEN);
    }
    get Logger() {
        return this._logger;
    }
}
exports.Service = Service;
//# sourceMappingURL=Service.js.map