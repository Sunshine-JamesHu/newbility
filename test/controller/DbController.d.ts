import { Controller } from '../../src/koa-core/src/controller/Controller';
export default class DbController extends Controller {
    Create(data: any): any;
    Query(key: string): string;
}
