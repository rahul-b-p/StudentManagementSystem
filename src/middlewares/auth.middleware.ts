import { NextFunction, Response } from "express";
import { customRequestWithPayload, TokenPayload } from "../types";
import { loggers } from "../utils/winston";
import { checkTokenBlacklist, verifyAccessToken } from "../config";
import { ErrorHandler } from "./errorHandler.middleware";
import { AuthenticationError } from "../errors";



export const JwtAuth = async (req: customRequestWithPayload, res: Response, next: NextFunction) => {
    try {
        const AccessToken = req.headers.authorization?.split(' ')[1];
        if (!AccessToken) return next(new AuthenticationError());
        
        const isJwtBlacklisted = await checkTokenBlacklist(AccessToken);
        if (isJwtBlacklisted) return next(new AuthenticationError());

        const tokenPayload: TokenPayload = await verifyAccessToken(AccessToken);
        const { id, role } = tokenPayload;
        req.payload = {
            id
        }
        next();

    } catch (error) {
        loggers.error(error);
        next(new AuthenticationError());
    }
}