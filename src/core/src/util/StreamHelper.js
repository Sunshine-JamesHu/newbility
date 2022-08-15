"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StreamHelper = void 0;
class StreamHelper {
    constructor() { }
    static StreamToBuffer(stream) {
        return new Promise((resolve, reject) => {
            const _buf = Array();
            stream.on('data', (chunk) => _buf.push(chunk));
            stream.on('end', () => resolve(Buffer.concat(_buf)));
            stream.on('error', (err) => reject(`error converting stream - ${err}`));
        });
    }
}
exports.StreamHelper = StreamHelper;
//# sourceMappingURL=StreamHelper.js.map