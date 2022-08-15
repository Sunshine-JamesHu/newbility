import { inject, injectable } from 'tsyringe';
export declare enum ServiceLifetime {
    Singleton = 0,
    Transient = 2
}
export interface InjectInfo {
    token: string;
    lifetime: ServiceLifetime;
    replace?: boolean;
}
export declare function Transient(token?: string): (target: Function) => void;
export declare function Singleton(token?: string): (target: Function) => void;
export declare function GetInjectInfo(target: Function): InjectInfo;
export declare function ReplaceService(): (target: Function) => void;
export declare function NeedReplaceService(target: Function): boolean;
export declare function AllowMultiple(): (target: Function) => void;
export declare function IsMultipleRegister(target: Function): boolean;
export declare function Abstract(): (target: Function) => void;
export declare function IsAbstract(target: Function): boolean;
export declare const Injectable: typeof injectable;
export declare const Inject: typeof inject;
export declare const Container: import("tsyringe").DependencyContainer;
export declare function GetInjectToken(token: string): string;
