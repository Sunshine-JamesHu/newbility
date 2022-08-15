/// <reference types="node" />
import { Stream } from 'stream';
export declare class StreamHelper {
    private constructor();
    static StreamToBuffer(stream: Stream): Promise<Buffer>;
}
