import bcrypt from 'bcrypt'
import { loggers } from '../utils/winston';

export const getEncryptedPassword = async (password: string): Promise<string> => {
    try {
        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const encryptedPassword: string = await bcrypt.hash(password, salt)
        loggers.info(encryptedPassword)
        return encryptedPassword;
    } catch (error) {
        loggers.error(error);
        throw new Error("An Error occur while password encryption");
    }
}

export const verifyPassword = async (password: string, hashPass: string): Promise<boolean> => {
    try {
        const isVerifiedPassword = await bcrypt.compare(password, hashPass);
        return isVerifiedPassword;
    } catch (error) {
        loggers.error(error);
        throw new Error("An Error occur while password verification");
    }
}