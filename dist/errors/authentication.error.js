"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordAuthenticationError = exports.AuthenticationError = void 0;
const customError_1 = require("../utils/customError");
class AuthenticationError extends customError_1.customError {
    constructor() {
        super('User unAuthenticated');
        this.StatusCode = 401;
        Object.setPrototypeOf(this, AuthenticationError.prototype);
    }
    serialize() {
        return { success: false, message: 'User UnAuthenticated' };
    }
}
exports.AuthenticationError = AuthenticationError;
class PasswordAuthenticationError extends customError_1.customError {
    constructor() {
        super('User unAuthenticated due to password verification');
        this.StatusCode = 401;
        Object.setPrototypeOf(this, PasswordAuthenticationError.prototype);
    }
    serialize() {
        return { success: false, message: 'Invalid Password' };
    }
}
exports.PasswordAuthenticationError = PasswordAuthenticationError;
