import 'reflect-metadata';
import { Program } from '@newbility/koa-core';
import { Startup } from './Startup';

class App extends Program {}

const app = new App(Startup);
app.Main();
