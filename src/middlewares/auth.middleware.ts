import { NextFunction, Response } from "express";
import { customRequestWithPayload, TokenPayload } from "../types";
import { loggers } from "../utils/winston.util";
import { checkTokenBlacklist, verifyAccessToken } from "../config";



export const JwtAuthMiddleware = async(req: customRequestWithPayload, res: Response, next: NextFunction) => {
    try {
        const AccessToken = req.headers.authorization?.split(' ')[1];
        if(!AccessToken){
            res.status(400).json({error:'Authorization failed due to inavailability of access token',message:'add your token for authorization'});
            return;
        }
        const isJwtBlacklisted = await checkTokenBlacklist(AccessToken);
        if (isJwtBlacklisted) {
            res.status(400).json({ error: 'Invalid token' });
            return;
        }


        const tokenPayload:TokenPayload = await verifyAccessToken(AccessToken);
        const {id,role} = tokenPayload;
        req.payload={
            id,
            role
        }
        next();
        
    } catch (error) {
        loggers.error(error);
        res.status(401).json({ error: 'unAuthorized', message: 'You are requested from unauthorized access' });
    }
}