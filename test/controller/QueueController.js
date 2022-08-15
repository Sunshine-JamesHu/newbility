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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Request_1 = require("../../src/koa-core/src/router/Request");
const Controller_1 = require("../../src/koa-core/src/controller/Controller");
const RequestData_1 = require("../../src/koa-core/src/router/RequestData");
const Router_1 = require("../../src/koa-core/src/router/Router");
const Dependency_1 = require("../../src/core/src/di/Dependency");
const QueueFactory_1 = require("../../src/queue-core/src/QueueFactory");
const moment_1 = __importDefault(require("moment"));
let QueueController = class QueueController extends Controller_1.Controller {
    constructor(_queueFactory) {
        super();
        this._queueFactory = _queueFactory;
    }
    async PostTest(data) {
        const publisher = this._queueFactory.GetPublisher();
        await publisher.PublishAsync('test', {
            title: 'newbility-test',
            time: (0, moment_1.default)().toDate(),
        });
        await publisher.PublishAsync('zmsignal', {
            title: 'newbility-zmsignal',
            time: (0, moment_1.default)().toDate(),
        });
        return 1;
    }
};
__decorate([
    (0, Request_1.HttpPost)(),
    __param(0, (0, RequestData_1.RequestBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], QueueController.prototype, "PostTest", null);
QueueController = __decorate([
    (0, Dependency_1.Injectable)(),
    (0, Dependency_1.Transient)(),
    (0, Router_1.Router)({ desc: '管道测试' }),
    __param(0, (0, Dependency_1.Inject)(QueueFactory_1.QUEUE_FACTORY_INJECT_TOKEN)),
    __metadata("design:paramtypes", [Object])
], QueueController);
exports.default = QueueController;
//# sourceMappingURL=QueueController.js.map