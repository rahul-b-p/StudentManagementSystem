import { customError } from "../utils/customError";



export class AuthenticationError extends customError {
    constructor() {
        super('User unAuthenticated');
        Object.setPrototypeOf(this, AuthenticationError.prototype);
    }
    StatusCode = 401;
    serialize(): { success: false, message: string; } {
        return { success:false,message: 'User UnAuthenticated' };
    }
}