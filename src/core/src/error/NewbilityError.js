"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewbilityError = void 0;
class NewbilityError extends Error {
    constructor(msg, data) {
        super(msg);
        this.data = data;
    }
}
exports.NewbilityError = NewbilityError;
//# sourceMappingURL=NewbilityError.js.map