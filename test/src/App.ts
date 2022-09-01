import 'reflect-metadata';
import { Program } from '@newbility/koa-core';
import { Startup } from './Startup';
// import { UseNacosAsync } from '@newbility/nacos';

class App extends Program {
  protected override async InitSettingManager(): Promise<void> {
    super.InitSettingManager();
    // await UseNacosAsync();
  }
}

const app = new App(Startup);
app.Main();
