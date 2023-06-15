import { createReadStream, readFileSync } from 'fs';
import { join } from 'path';

import type { HelperDelegate, HelperOptions } from 'handlebars';
import * as Handlebars from 'handlebars';
import type { Context, Middleware, Next } from 'koa';
import { defaultsDeep } from 'lodash';

export interface SwaggerOptions {
  [key: string]: string | boolean | string[] | Record<string, unknown> | null | undefined;
  dom_id?: string;
  url?: string;
  supportedSubmitMethods?: string[];
  docExpansion?: string;
  jsonEditor?: boolean;
  defaultModelRendering?: string;
  showRequestHeaders?: boolean;
  layout?: string;
  spec?: Record<string, unknown>;
  validatorUrl?: string | null;
}

export interface KoaSwaggerUiOptions {
  title: string;
  oauthOptions: boolean | any;
  swaggerOptions: SwaggerOptions;
  swaggerVersion: string;
  routePrefix: string | false;
  specPrefix: string;
  exposeSpec: boolean;
  hideTopbar: boolean;
  favicon: string;
  customCSS: string;
}

const defaultOptions: KoaSwaggerUiOptions = {
  title: 'Swagger UI',
  oauthOptions: false,
  swaggerOptions: {
    dom_id: '#swagger-ui',
    url: '/swagger.json',
    layout: 'StandaloneLayout',
  },
  routePrefix: '/docs',
  specPrefix: '/docs/spec',
  swaggerVersion: '4.1.0',
  exposeSpec: false,
  hideTopbar: false,
  favicon: '/favicon.png',
  customCSS: '',
};

export function koaSwagger(config: Partial<KoaSwaggerUiOptions> = {}): Middleware {
  // Setup icons
  const extFavicon = config.favicon;
  const faviconPath = join(__dirname, defaultOptions.favicon);

  // Setup default options
  const options: KoaSwaggerUiOptions = defaultsDeep(config, defaultOptions);

  const specPrefixRegex = new RegExp(`${options.specPrefix}[/]*$`, 'i');
  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  const routePrefixRegex = new RegExp(`${options.routePrefix}[/]*$`, 'i');

  Handlebars.registerHelper('json', (context) => JSON.stringify(context));
  Handlebars.registerHelper('strfnc', (fnc: HelperDelegate) => fnc);
  Handlebars.registerHelper('isset', function (this: any, conditional: any, opt: HelperOptions) {
    return conditional ? opt.fn(this) : opt.inverse(this);
  });
  const index = Handlebars.compile(readFileSync(join(__dirname, './index.hbs'), 'utf-8'));

  // eslint-disable-next-line func-names
  return function koaSwaggerUi(ctx: Context, next: Next) {
    if (options.exposeSpec && specPrefixRegex.test(ctx.path)) {
      ctx.body = options.swaggerOptions.spec;
      return true;
    }

    if (options.routePrefix === false || routePrefixRegex.test(ctx.path)) {
      ctx.type = 'text/html';
      ctx.body = index(options);
      return true;
    }

    if (extFavicon === undefined && ctx.path === defaultOptions.favicon) {
      ctx.type = 'image/png';
      ctx.body = createReadStream(faviconPath);
      return true;
    }

    return next();
  };
}
