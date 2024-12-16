import { customError } from "../utils/customError";



export class BadRequestError extends customError {
    constructor() {
        super('Bad Request');
        Object.setPrototypeOf(this, BadRequestError.prototype);
    }
    StatusCode = 401;
    serialize(): { success: false, message: string; } {
        return { success: false, message: 'Bad Request' };
    }
}