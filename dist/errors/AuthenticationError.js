"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticationError = void 0;
const customError_1 = require("../utils/customError");
class AuthenticationError extends customError_1.customError {
    constructor() {
        super('User unAuthenticated');
        this.StatusCode = 401;
        Object.setPrototypeOf(this, AuthenticationError.prototype);
    }
    serialize() {
        return { message: 'User UnAuthenticated' };
    }
}
exports.AuthenticationError = AuthenticationError;
