"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RersourceNotFoundError = exports.NotFoundError = void 0;
const customError_1 = require("../utils/customError");
class NotFoundError extends customError_1.customError {
    constructor() {
        super('User Not Found');
        this.StatusCode = 404;
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }
    serialize() {
        return { success: false, message: 'The user associated with the provided token does not exist.' };
    }
}
exports.NotFoundError = NotFoundError;
class RersourceNotFoundError extends customError_1.customError {
    constructor() {
        super('Resource Not Found');
        this.StatusCode = 404;
        Object.setPrototypeOf(this, RersourceNotFoundError.prototype);
    }
    serialize() {
        return { success: false, message: 'The requested resource was not found' };
    }
}
exports.RersourceNotFoundError = RersourceNotFoundError;
