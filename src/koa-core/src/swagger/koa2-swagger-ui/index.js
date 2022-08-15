"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.koaSwagger = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const Handlebars = __importStar(require("handlebars"));
const lodash_1 = require("lodash");
const defaultOptions = {
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
function koaSwagger(config = {}) {
    // Setup icons
    const extFavicon = config.favicon;
    const faviconPath = (0, path_1.join)(__dirname, defaultOptions.favicon);
    // Setup default options
    const options = (0, lodash_1.defaultsDeep)(config, defaultOptions);
    const specPrefixRegex = new RegExp(`${options.specPrefix}[/]*$`, 'i');
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    const routePrefixRegex = new RegExp(`${options.routePrefix}[/]*$`, 'i');
    Handlebars.registerHelper('json', (context) => JSON.stringify(context));
    Handlebars.registerHelper('strfnc', (fnc) => fnc);
    Handlebars.registerHelper('isset', function (conditional, opt) {
        return conditional ? opt.fn(this) : opt.inverse(this);
    });
    const index = Handlebars.compile((0, fs_1.readFileSync)((0, path_1.join)(__dirname, './index.hbs'), 'utf-8'));
    // eslint-disable-next-line func-names
    return function koaSwaggerUi(ctx, next) {
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
            ctx.body = (0, fs_1.createReadStream)(faviconPath);
            return true;
        }
        return next();
    };
}
exports.koaSwagger = koaSwagger;
//# sourceMappingURL=index.js.map