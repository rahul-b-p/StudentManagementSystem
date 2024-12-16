import { customError } from "../utils/customError";



export class ConflictError extends customError {
    constructor() {
        super('already Exists');
        Object.setPrototypeOf(this, ConflictError.prototype);
    }
    StatusCode = 409;
    serialize(): { success: false, message: string; } {
        return { success: false, message: 'Already Exists' };
    }
}