export interface IDisposable {
    Dispose(): void;
}
export interface IAsyncDisposable {
    DisposeAsync(): Promise<void>;
}
export declare function UsingAsync<TResult = void>(ins: IAsyncDisposable | IDisposable, func: () => Promise<TResult> | TResult): Promise<TResult>;
