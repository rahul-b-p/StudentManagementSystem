import { customError } from "../utils/customError";



export class ForbiddenError extends customError {
    constructor() {
        super('Forbidden');
        Object.setPrototypeOf(this, ForbiddenError.prototype);
    }
    StatusCode = 403;
    serialize(): { success: false, message: string; } {
        return { success: false, message: 'You do not have the necessary permissions to access this resource.' };
    }
}