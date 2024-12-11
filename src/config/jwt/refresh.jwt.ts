import jwt from 'jsonwebtoken';
import { loggers } from '../../utils/winston.util';
import { TokenPayload } from '../../types';



export const signRefreshToken = async (id: string, role: 'admin' | 'user'): Promise<string> => {
    try {
        const secretKey = process.env.REFRESH_TOKEN_SECRET;
        if (!secretKey) {
            throw new Error("Can't Find secret key to sign Access token")
        }
        const payload: TokenPayload = {
            id, role
        };
        const RefreshToken = jwt.sign(payload, secretKey, { expiresIn: '1y' });
        return RefreshToken;
    } catch (error) {
        loggers.error(error);
        throw new Error("Can't Get Access Token");
    }
}

export const verifyRefreshToken = async (token: string): Promise<TokenPayload | null> => {
    try {

        const secretKey = process.env.REFRESH_TOKEN_SECRET;
        if (!secretKey) {
            throw new Error("Can't find the secret key to sign the Access token");
        }

        const result = jwt.verify(token, secretKey) as TokenPayload | null;
        return result || null; 
    } catch (error) {
        return null;
    }
}