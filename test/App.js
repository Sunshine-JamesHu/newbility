"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const Program_1 = require("../src/koa-core/src/Program");
const Startup_1 = require("./Startup");
const app = new Program_1.Program(Startup_1.Startup);
app.Main();
//# sourceMappingURL=App.js.map