"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitSettingManager = exports.SettingManager = exports.SETTING_INJECT_TOKEN = void 0;
const fs = __importStar(require("fs"));
const Dependency_1 = require("../di/Dependency");
exports.SETTING_INJECT_TOKEN = (0, Dependency_1.GetInjectToken)('Sys:ISettingManager');
let SettingManager = class SettingManager {
    GetConfig(key) {
        const keyPath = key.split(':');
        let cfg = APP_CONFIG[keyPath[0]];
        for (let index = 1; index < keyPath.length; index++) {
            const element = keyPath[index];
            if (cfg)
                cfg = cfg[element];
            else
                return undefined;
        }
        return cfg;
    }
};
SettingManager = __decorate([
    (0, Dependency_1.Singleton)(exports.SETTING_INJECT_TOKEN)
], SettingManager);
exports.SettingManager = SettingManager;
const APP_CONFIG = {};
const SetConfig = (cfg) => {
    for (const key in cfg) {
        if (cfg.hasOwnProperty(key)) {
            APP_CONFIG[key] = cfg[key];
        }
    }
};
function InitSettingManager() {
    try {
        let appConfig = '';
        if (process.env.Config_FILE && fs.existsSync(process.env.Config_FILE)) {
            appConfig = fs.readFileSync(process.env.Config_FILE, 'utf-8');
        }
        else {
            appConfig = fs.readFileSync('./app.config.json', 'utf-8');
        }
        if (!appConfig)
            throw new Error();
        SetConfig(JSON.parse(appConfig));
    }
    catch (error) {
        console.warn('App配置为空,采用默认配置');
        SetConfig({
            port: 30000,
        });
    }
    Dependency_1.Container.registerSingleton(exports.SETTING_INJECT_TOKEN, SettingManager); // 直接注入到容器中
}
exports.InitSettingManager = InitSettingManager;
//# sourceMappingURL=SettingManager.js.map