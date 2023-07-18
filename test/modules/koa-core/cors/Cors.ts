import Koa from 'koa';
import cors from 'koa2-cors';

export interface CorsOptions extends cors.Options {}

export function AddCors(app: Koa, options?: CorsOptions) {
  app.use(cors(options));
}
