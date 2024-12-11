import jwt, { JwtPayload } from 'jsonwebtoken';
import { loggers } from '../../utils/winston.util';



export const signRefreshToken = async (id: string, role: 'admin' | 'user'): Promise<string> => {
    try {
        const secretKey = process.env.REFRESH_TOKEN_SECRET;
        if (!secretKey) {
            throw new Error("Can't Find secret key to sign Access token")
        }
        const payload: JwtPayload = {
            id, role
        };
        const RefreshToken = jwt.sign(payload, secretKey,{expiresIn:'1y'});
        return RefreshToken;
    } catch (error) {
        loggers.error(error);
        throw new Error("Can't Get Access Token");
    }
}
