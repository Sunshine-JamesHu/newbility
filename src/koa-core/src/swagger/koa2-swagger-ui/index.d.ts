import type { Middleware } from 'koa';
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
export declare function koaSwagger(config?: Partial<KoaSwaggerUiOptions>): Middleware;
