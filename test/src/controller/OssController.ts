import fs from 'fs';
import { File } from 'formidable';

import { HttpDelete, HttpGet, HttpPost, Controller, RequestBody, RequestQuery, Router } from '@newbility/koa-core';
import { Inject, Injectable, Transient, UserFriendlyError, StreamHelper, Guid } from '@newbility/core';
import { IOssService, OSS_SVC_INJECT_TOKEN } from '@newbility/oss-core';
import { lookup } from 'mime-types';

@Injectable()
@Transient()
@Router({ desc: 'Oss存储测试' })
export default class OssController extends Controller {
  constructor(@Inject(OSS_SVC_INJECT_TOKEN) private readonly _ossService: IOssService) {
    super();
  }

  @HttpGet()
  async GetFile(@RequestQuery('path') path: string): Promise<Buffer> {
    const mimeType = lookup(path) || 'application/octet-stream';
    this.Context.set('Content-Type', mimeType);
    this.Context.set('Content-Disposition', `filename=${path.substring(path.indexOf('/') + 1)}`);
    const res = await this._ossService.GetAsync(path);
    return res;
  }

  @HttpPost()
  async UploadFile(@RequestBody() data: { group: string | undefined; data?: File }): Promise<string> {
    if (data && data.data) {
      const reader = fs.createReadStream(data.data.filepath);
      const buffer = await StreamHelper.StreamToBuffer(reader);
      return await this._ossService.SaveAsync(buffer, data.data.originalFilename || Guid.Create(), data.group);
    }
    throw new UserFriendlyError('请选择一个文件进行上传');
  }

  @HttpDelete()
  async DeleteFile(@RequestQuery('path') path: string): Promise<void> {
    await this._ossService.RemoveAsync(path);
  }
}
