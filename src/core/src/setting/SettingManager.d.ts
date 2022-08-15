export declare const SETTING_INJECT_TOKEN: string;
export interface ISettingManager {
    GetConfig<TConfig = any>(key: string): TConfig | undefined;
}
export declare class SettingManager implements ISettingManager {
    GetConfig<TConfig = any>(key: string): TConfig | undefined;
}
export declare function InitSettingManager(): void;
