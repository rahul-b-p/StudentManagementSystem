import { NextFunction, Response } from "express";
import { customRequestWithPayload, TokenPayload } from "../types";
import { loggers } from "../utils/winston.util";
import { verifyAccessToken } from "../config";



export const JwtAuthMiddleware = async(req: customRequestWithPayload, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if(!token){
            res.status(400).json({error:'Authorization failed due to inavailability of access token',message:'add your token for authorization'});
            return;
        }

        const tokenPayload:TokenPayload = await verifyAccessToken(token);
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