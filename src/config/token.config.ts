import jwt from 'jsonwebtoken';
import { TokenPayload } from '../types';
import redisClient from '../utils/redis.util';
import { loggers } from '../utils/winston.util';


export const blackListToken = async (token: string): Promise<boolean> => {
    try {
        const { exp } = jwt.decode(token) as TokenPayload;
        const expiresIn = exp - Math.floor(Date.now() / 1000);
        const result = await redisClient.set(token, 'Blacklisted', { 'EX': expiresIn });
        return result ? true : false;
    } catch (error) {
        loggers.error(error);
        throw new Error("Can't Blacklist Token");
    }
}

export const checkTokenBlacklist = async (token: string): Promise<boolean> => {
    try {
        const result = await redisClient.get(token);
        return result ? true : false;
    } catch (error) {
        loggers.error(error);
        throw new Error("Can't check the token now");
    }
}