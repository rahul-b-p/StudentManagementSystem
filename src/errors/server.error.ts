import { customError } from "../utils/customError";



export class InternalServerError extends customError {
    constructor() {
        super('Internal Server Error');
        Object.setPrototypeOf(this, InternalServerError.prototype);
    }
    StatusCode = 404;
    serialize(): { success: false, message: string; } {
        return { success: false, message: 'Something went wrong on server' };
    }
}