export declare enum RequestParamType {
    Body = 0,
    Param = 1
}
interface ActionParams {
    in: 'body' | 'query';
    key?: string;
    index: number;
    type: any;
}
export declare function RequestQuery(paramName?: string): (target: any, key: string, index: number) => void;
export declare function RequestBody(): (target: any, key: string, index: number) => void;
export declare function GetActionParamsMetadata(target: any): Array<ActionParams>;
export {};
