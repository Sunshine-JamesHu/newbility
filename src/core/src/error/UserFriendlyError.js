"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserFriendlyError = void 0;
const NewbilityError_1 = require("./NewbilityError");
class UserFriendlyError extends NewbilityError_1.NewbilityError {
    constructor(msg, data, status) {
        super(msg, data);
        this.status = status;
    }
}
exports.UserFriendlyError = UserFriendlyError;
//# sourceMappingURL=UserFriendlyError.js.map