import type { Context } from 'koa';
import { CreateStorage } from './AsyncHooksStorage';

const { run, useContext } = CreateStorage<Context>();

export { run, useContext };
