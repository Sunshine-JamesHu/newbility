import 'reflect-metadata';
import { Program } from '@newbility/koa-core';
import { Startup } from './Startup';

const app = new Program(Startup);
app.Main();
