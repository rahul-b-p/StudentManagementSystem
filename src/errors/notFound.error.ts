import { customError } from "../utils/customError";



export class NotFoundError extends customError {
    constructor() {
        super('User Not Found');
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }
    StatusCode = 404;
    serialize(): { success: false, message: string; } {
        return { success: false, message: 'The user associated with the provided token does not exist.' };
    }
}