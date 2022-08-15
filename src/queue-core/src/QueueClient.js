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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueueClient = void 0;
const async_lock_1 = __importDefault(require("async-lock"));
const Logger_1 = require("../../core/src/logger/Logger");
const Dependency_1 = require("../../core/src/di/Dependency");
let QueueClient = class QueueClient {
    constructor(key, disposeTime) {
        this._key = key;
        this._logger = Dependency_1.Container.resolve(Logger_1.LOGGER_INJECT_TOKEN);
        this._disposeTime = this.GetDisposeTime(disposeTime);
        this._lock = this.GetAsyncLock();
    }
    get Logger() {
        return this._logger;
    }
    async GetClient() {
        // 如果有
        if (this._disposeTime > 0) {
            this.StartOrReBuildTimer();
        }
        if (this.client)
            return this.client;
        return await new Promise((resolve, reject) => {
            const localKey = `get_client_${this._key}`;
            this._lock.acquire(localKey, async (done) => {
                if (this.client) {
                    done(undefined, this.client);
                }
                else {
                    try {
                        this.Logger.LogDebug(`开始连接${this._key}`);
                        const client = await this.CreateClient();
                        this.Logger.LogDebug(`${this._key}连接成功`);
                        done(undefined, client);
                    }
                    catch (error) {
                        done(error);
                    }
                }
            }, (err, client) => {
                if (err) {
                    this.Logger.LogError(`Get [${this._key}] client error`, err);
                    reject(err);
                }
                else if (client) {
                    if (this.client != client) {
                        this.client = client;
                    }
                    resolve(client);
                }
                else {
                    reject();
                }
            });
        });
    }
    async DisposeAsync() {
        if (this.client) {
            await this.DisconnectClient(this.client);
            this.client = undefined;
        }
    }
    GetAsyncLock() {
        return new async_lock_1.default({ timeout: 3000, maxPending: 2000 });
    }
    GetDisposeTime(disposeTime) {
        if (!disposeTime)
            disposeTime = 1000 * 30; // 默认30秒
        return disposeTime;
    }
    StartOrReBuildTimer() {
        if (this.clientTimer)
            clearTimeout(this.clientTimer);
        this.clientTimer = setTimeout(async () => {
            if (this.clientTimer) {
                this.Logger.LogDebug(`${this._key}客户端长时间无操作,开始断开客户端`);
                await this.DisposeAsync();
                this.Logger.LogDebug(`${this._key}客户端已经成功断开`);
            }
        }, this._disposeTime);
    }
};
QueueClient = __decorate([
    (0, Dependency_1.Abstract)(),
    __metadata("design:paramtypes", [String, Number])
], QueueClient);
exports.QueueClient = QueueClient;
//# sourceMappingURL=QueueClient.js.map