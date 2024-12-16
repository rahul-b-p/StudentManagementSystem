"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForbiddenError = void 0;
const customError_1 = require("../utils/customError");
class ForbiddenError extends customError_1.customError {
    constructor() {
        super('Forbidden');
        this.StatusCode = 403;
        Object.setPrototypeOf(this, ForbiddenError.prototype);
    }
    serialize() {
        return { success: false, message: 'You do not have the necessary permissions to access this resource.' };
    }
}
exports.ForbiddenError = ForbiddenError;
