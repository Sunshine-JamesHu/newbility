import Koa from 'koa';
import cors from 'koa2-cors';
export interface CorsOptions extends cors.Options {
}
export declare function AddCors(app: Koa, options?: CorsOptions): void;
