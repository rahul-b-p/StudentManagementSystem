"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadRequestError = void 0;
const customError_1 = require("../utils/customError");
class BadRequestError extends customError_1.customError {
    constructor() {
        super('Bad Request');
        this.StatusCode = 401;
        Object.setPrototypeOf(this, BadRequestError.prototype);
    }
    serialize() {
        return { success: false, message: 'Bad Request' };
    }
}
exports.BadRequestError = BadRequestError;
