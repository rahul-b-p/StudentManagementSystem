

export abstract class customError extends Error {
    constructor(public message: string) {
        super(message);
    }
    abstract StatusCode: number;
    abstract serialize(): { success:false, message: string }
}