"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Publisher = void 0;
const Logger_1 = require("../../../core/src/logger/Logger");
const Dependency_1 = require("../../../core/src/di/Dependency");
let Publisher = class Publisher {
    constructor() {
        this._logger = Dependency_1.Container.resolve(Logger_1.LOGGER_INJECT_TOKEN);
    }
    get Logger() {
        return this._logger;
    }
};
Publisher = __decorate([
    (0, Dependency_1.Abstract)(),
    __metadata("design:paramtypes", [])
], Publisher);
exports.Publisher = Publisher;
//# sourceMappingURL=Publisher.js.map