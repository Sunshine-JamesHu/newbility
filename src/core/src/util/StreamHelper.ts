import { Stream } from 'stream';

export class StreamHelper {
  private constructor() {}

  static StreamToBuffer(stream: Stream) {
    return new Promise<Buffer>((resolve, reject) => {
      const _buf = Array<any>();

      stream.on('data', (chunk: any) => _buf.push(chunk));
      stream.on('end', () => resolve(Buffer.concat(_buf)));
      stream.on('error', (err: any) => reject(`error converting stream - ${err}`));
    });
  }
}
