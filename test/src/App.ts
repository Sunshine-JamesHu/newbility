import 'reflect-metadata';
import { Program } from '@newbility/koa-core';
import { Startup } from './Startup';
import { UseNascos } from './modules/nacos/NacosExtensions';

class App extends Program {
  protected InitSettingManager(): void {
    super.InitSettingManager();
    UseNascos();
  }
}

const app = new App(Startup);
app.Main();
