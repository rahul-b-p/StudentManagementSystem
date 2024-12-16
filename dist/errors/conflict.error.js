"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConflictError = void 0;
const customError_1 = require("../utils/customError");
class ConflictError extends customError_1.customError {
    constructor() {
        super('already Exists');
        this.StatusCode = 409;
        Object.setPrototypeOf(this, ConflictError.prototype);
    }
    serialize() {
        return { success: false, message: 'Already Exists' };
    }
}
exports.ConflictError = ConflictError;
