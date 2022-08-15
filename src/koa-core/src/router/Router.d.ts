export interface RouterInfo {
    path: string;
    desc?: string;
}
export declare function Router(data?: string | {
    path?: string;
    desc?: string;
}): (target: Function) => void;
export declare function GetRouterPath(target: any): string;
export declare function GetRouterInfo(target: any): RouterInfo;
