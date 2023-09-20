import 'reflect-metadata';
// import { Program } from '@newbility/koa-core';
import { Program } from '../modules/koa-core/Program';
import { Startup } from './Startup';
import { Server } from 'http';
import { AttachToServer } from '../modules/socket/SocketServer';
// import { UseNacosAsync } from '@newbility/nacos';

class App extends Program {
  protected override async InitSettingManager(): Promise<void> {
    super.InitSettingManager();
    // await UseNacosAsync();
  }

  protected RegisterCompToHttpServer(httpServer: Server) {
    AttachToServer(httpServer);
  }
}

const app = new App(Startup);
app.Main();
