import { Controller, HttpGet, Router } from '@newbility/koa-core';
import { Injectable, ISettingManager, Transient, Inject, SETTING_INJECT_TOKEN } from '@newbility/core';

@Injectable()
@Transient()
@Router({ desc: 'Newbility-Home' })
export default class HomeController extends Controller {
  private readonly _settingManager: ISettingManager;
  constructor(@Inject(SETTING_INJECT_TOKEN) settingManager: ISettingManager) {
    super();
    this._settingManager = settingManager;
  }
  @HttpGet()
  GetVersion() {
    const version = this._settingManager.GetConfig('version') || '0.0.0';
    return { version };
  }

  @HttpGet()
  Health() {
    return { status: 'healthy' };
  }
}
