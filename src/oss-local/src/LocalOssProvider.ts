import fs from 'fs';
import path from 'path';
import moment from 'moment';
import { Singleton, Inject, Injectable, Guid, StreamHelper, NewbilityError } from '@newbility/core';
import { GetProviderInjectToken, OssProvider, GetOssOptionsInjectToken } from '@newbility/oss-core';
import { LocalOssOptions } from './LocalOssOptions';
import { OSS_KEY } from './LocalOssConst';

@Injectable()
@Singleton(GetProviderInjectToken(OSS_KEY))
export class LocalOssProvider extends OssProvider {
  private readonly _options: LocalOssOptions;
  constructor(@Inject(GetOssOptionsInjectToken(OSS_KEY)) options: LocalOssOptions) {
    super();
    this._options = options;
  }

  async GetAsync(path: string): Promise<Buffer> {
    if (!fs.existsSync(path)) {
      throw new NewbilityError(`File not find. filePath->${path}`);
    }

    const reader = fs.createReadStream(path);
    const buffer = await StreamHelper.StreamToBuffer(reader);
    return buffer;
  }

  async SaveAsync(data: Buffer, fileName: string, group?: string): Promise<string> {
    const dir = this.GetFullDir(group);
    const newFileName = this.GenFileName(fileName);
    const fullFileName = `${dir}/${newFileName}`;
    if (this.MkdirSync(dir)) {
      await this.WriteFileAsync(fullFileName, data);
    }
    return fullFileName;
  }

  async RemoveAsync(path: string): Promise<void> {
    await this.RemoveFileAsync(path);
  }

  protected GetFullDir(group?: string | undefined) {
    const dirPath = [];

    // 根目录
    if (this._options.dir) {
      dirPath.push(this._options.dir);
    }

    // 桶目录
    const bucketName = group || this._defaultGroup;
    dirPath.push(bucketName);

    // 时间目录
    dirPath.push(this.GetTimeDirName());

    return dirPath.join('/');
  }

  protected GetTimeDirName(): string {
    return moment().format('YYYY/MM/DD');
  }

  protected GenFileName(fileName: string) {
    const f = this.GetFileType(fileName);

    let newFileName = Guid.Create();
    if (f) newFileName = `${newFileName}${f}`;

    return newFileName;
  }

  private MkdirSync(dirname: string): boolean {
    if (fs.existsSync(dirname)) {
      return true;
    } else {
      if (this.MkdirSync(path.dirname(dirname))) {
        fs.mkdirSync(dirname);
        return true;
      }
    }
    return false;
  }

  private WriteFileAsync(path: string, data: Buffer): Promise<boolean> {
    return new Promise((resovle, reject) => {
      fs.writeFile(path, data, (err) => {
        if (err) reject(err);
        else resovle(true);
      });
    });
  }

  private RemoveFileAsync(path: string): Promise<boolean> {
    return new Promise((resovle, reject) => {
      fs.rm(path, (err) => {
        if (err) reject(err);
        else resovle(true);
      });
    });
  }
}
