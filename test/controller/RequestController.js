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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const Request_1 = require("../../src/koa-core/src/router/Request");
const Controller_1 = require("../../src/koa-core/src/controller/Controller");
const RequestData_1 = require("../../src/koa-core/src/router/RequestData");
const Router_1 = require("../../src/koa-core/src/router/Router");
const Dependency_1 = require("../../src/core/src/di/Dependency");
let RequestController = class RequestController extends Controller_1.Controller {
    GetTest(key) {
        return key;
    }
};
__decorate([
    (0, Request_1.HttpGet)(),
    __param(0, (0, RequestData_1.RequestQuery)('key')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RequestController.prototype, "GetTest", null);
RequestController = __decorate([
    (0, Dependency_1.Injectable)(),
    (0, Dependency_1.Transient)(),
    (0, Router_1.Router)({ desc: '请求测试' })
], RequestController);
exports.default = RequestController;
//# sourceMappingURL=RequestController.js.map