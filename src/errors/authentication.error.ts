import { customError } from "../utils/customError";



export class AuthenticationError extends customError {
    constructor() {
        super('User unAuthenticated');
        Object.setPrototypeOf(this, AuthenticationError.prototype);
    }
    StatusCode = 401;
    serialize(): { success: false, message: string; } {
        return { success: false, message: 'User UnAuthenticated' };
    }
}

export class PasswordAuthenticationError extends customError {
    constructor() {
        super('User unAuthenticated due to password verification');
        Object.setPrototypeOf(this, PasswordAuthenticationError.prototype);
    }
    StatusCode = 401;
    serialize(): { success: false, message: string; } {
        return { success: false, message: 'Invalid Password' };
    }
}