export declare class Guid {
    private static readonly _empty;
    private constructor();
    static Create(): string;
    static Empty(): string;
    static IsEmpty(id: string): boolean;
    static IsGuid(id: string): boolean;
}
