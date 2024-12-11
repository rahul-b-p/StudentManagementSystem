import { loggers } from "../utils/winston.util";

export const generateId = async (): Promise<string> => {
    try {
        const timestamp: string = Date.now().toString(16);
        const randomString: string = crypto.randomUUID();
        const uniqueId: string = (randomString + timestamp).slice(-23);
        return uniqueId;
    } catch (error) {
        loggers.error(error);
        throw new Error("Can't generate Id due to an error")
    }
}
