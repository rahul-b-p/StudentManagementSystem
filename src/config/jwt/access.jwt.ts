import jwt from 'jsonwebtoken';
import { loggers } from '../../utils/winston';
import { roles, TokenPayload } from '../../types';


export const signAccessToken = async (id: string, role: roles): Promise<string> => {
    try {
        const secretKey = process.env.ACCESS_TOKEN_SECRET;
        if (!secretKey) {
            throw new Error("Can't Find secret key to sign Access token")
        }

        const AccessToken = jwt.sign({ id, role }, secretKey, { expiresIn: '7h' });
        return AccessToken;
    } catch (error) {
        loggers.error(error);
        throw new Error("Can't Get Access Token");
    }
}

export const verifyAccessToken = async (token: string): Promise<TokenPayload> => {
    try {
        const secretKey = process.env.ACCESS_TOKEN_SECRET;
        if (!secretKey) {
            throw new Error("Can't Find secret key to sign Access token");
        }
        const result = jwt.verify(token, secretKey) as TokenPayload
        return result;
    } catch (error) {
        throw new Error("unauthorized token");
    }
}


