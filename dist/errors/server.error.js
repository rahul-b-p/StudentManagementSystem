"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalServerError = void 0;
const customError_1 = require("../utils/customError");
class InternalServerError extends customError_1.customError {
    constructor() {
        super('Internal Server Error');
        this.StatusCode = 404;
        Object.setPrototypeOf(this, InternalServerError.prototype);
    }
    serialize() {
        return { success: false, message: 'Something went wrong on server' };
    }
}
exports.InternalServerError = InternalServerError;
