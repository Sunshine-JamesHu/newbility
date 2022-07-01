import 'reflect-metadata';
import { Program } from '../src/koa-core/src/Program';
import { Startup } from './Startup';

const app = new Program(Startup);
app.Main();
