export declare enum HttpMethod {
    GET = 0,
    POST = 1,
    PUT = 2,
    DELETE = 3,
    OPTIONS = 4
}
export interface ActionInfo {
    name?: string;
    desc?: string;
}
export interface FullActionInfo extends ActionInfo {
    httpMethod: HttpMethod;
    name: string;
}
export declare function HttpGet(data?: string | ActionInfo): (target: any, key: string, descriptor: PropertyDescriptor) => void;
export declare function HttpPost(data?: string | ActionInfo): (target: any, key: string, descriptor: PropertyDescriptor) => void;
export declare function HttpPut(data?: string | ActionInfo): (target: any, key: string, descriptor: PropertyDescriptor) => void;
export declare function HttpDelete(data?: string | ActionInfo): (target: any, key: string, descriptor: PropertyDescriptor) => void;
export declare function HttpOptions(data?: string | ActionInfo): (target: any, key: string, descriptor: PropertyDescriptor) => void;
export declare function HttpRequest(httpMethod: HttpMethod, data?: string | ActionInfo): (target: any, key: string, descriptor: PropertyDescriptor) => void;
export declare function GetHttpMethodStr(httpMethod: HttpMethod): string;
export declare function GetActionInfo(action: Function): FullActionInfo;
