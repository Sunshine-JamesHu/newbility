"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Guid = void 0;
const uuid_1 = require("uuid");
class Guid {
    constructor() { }
    static Create() {
        return (0, uuid_1.v4)();
    }
    static Empty() {
        return this._empty;
    }
    static IsEmpty(id) {
        return id === this.Empty();
    }
    static IsGuid(id) {
        return (0, uuid_1.validate)(id);
    }
}
exports.Guid = Guid;
Guid._empty = '00000000-0000-0000-0000-000000000000';
//# sourceMappingURL=Guid.js.map