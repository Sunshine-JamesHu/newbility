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
exports.QueueModule = void 0;
const SettingManager_1 = require("../../core/src/setting/SettingManager");
const AppModule_1 = require("../../core/src/modularity/AppModule");
const Dependency_1 = require("../../core/src/di/Dependency");
const Queue_1 = require("./Queue");
const Logger_1 = require("../../core/src/logger/Logger");
let QueueModule = class QueueModule extends AppModule_1.AppModule {
    constructor(queueType) {
        super();
        this._queueType = queueType;
        this._settings = Dependency_1.Container.resolve(SettingManager_1.SETTING_INJECT_TOKEN);
        this._logger = Dependency_1.Container.resolve(Logger_1.LOGGER_INJECT_TOKEN);
    }
    OnPreApplicationInitialization() {
        this.InitQueue();
    }
    OnPostApplicationInitialization() {
        // await this.StartSubscriber();
        // 放进后台进行启动,不占用主线程
        this.StartSubscriber().then(() => {
            this._logger.LogDebug('Queue started');
        }, (err) => {
            this._logger.LogError('Queue start error', err);
        });
    }
    InitQueue() {
        const queueSettings = this._settings.GetConfig('queues');
        if (!queueSettings)
            return;
        const queueKeys = Object.getOwnPropertyNames(queueSettings);
        if (!queueKeys || !queueKeys.length)
            return;
        queueKeys.forEach((key) => {
            const queueSetting = queueSettings[key];
            if (queueSetting && queueSetting.type === this._queueType) {
                this.RegisterQueue(key, queueSetting.options);
            }
        });
    }
    async StartSubscriber() {
        const queueSettings = this._settings.GetConfig('queues');
        if (!queueSettings)
            return;
        const queueKeys = Object.getOwnPropertyNames(queueSettings);
        if (!queueKeys || !queueKeys.length)
            return;
        for (let index = 0; index < queueKeys.length; index++) {
            const key = queueKeys[index];
            const queueSetting = queueSettings[key];
            if (queueSetting && queueSetting.type === this._queueType) {
                const token = (0, Queue_1.GetQueueInjectToken)(key, Queue_1.QueueSubType.Subscriber);
                if (Dependency_1.Container.isRegistered(token)) {
                    const queue = Dependency_1.Container.resolve(token);
                    await queue.StartAsync();
                }
            }
        }
    }
};
QueueModule = __decorate([
    (0, Dependency_1.Abstract)(),
    __metadata("design:paramtypes", [String])
], QueueModule);
exports.QueueModule = QueueModule;
//# sourceMappingURL=QueueModule.js.map