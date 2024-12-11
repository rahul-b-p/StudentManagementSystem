import jwt, { JwtPayload } from 'jsonwebtoken';
import { loggers } from '../../utils/winston.util';
import { error } from 'console';
import { config } from 'dotenv';
config()


export const signAccessToken = async (id: string, role: 'admin' | 'user'): Promise<string> => {
    try {
        const secretKey = process.env.ACCESS_TOKEN_SECRET;
        if (!secretKey) {
            throw new Error("Can't Find secret key to sign Access token")
        }
        const payload: JwtPayload = {
            id, role
        };
        const AccessToken = jwt.sign(payload, secretKey, { expiresIn: '15s' });
        return AccessToken;
    } catch (error) {
        loggers.error(error);
        throw new Error("Can't Get Access Token");
    }
}

export const verifyAccessToken = async (token: string) => {
    try {
        const secretKey = process.env.ACCESS_TOKEN_SECRET;
        if (!secretKey){
            throw new Error("Can't Find secret key to sign Access token");
        }
        const result = jwt.verify(token,secretKey)
        loggers.info(result);
    } catch (error) {
        throw new Error("unauthorized token");
    }
}


