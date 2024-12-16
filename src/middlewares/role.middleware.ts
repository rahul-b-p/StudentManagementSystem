import { NextFunction, Response } from "express";
import { customRequestWithPayload, roles } from "../types";
import { loggers } from "../utils/winston";
import { findUserById } from "../services";
import { InternalServerError, NotFoundError } from "../errors";
import { ForbiddenError } from "../errors/forbidden.error";



export const verifyAdmin = async (req: customRequestWithPayload, res: Response, next: NextFunction) => {
    try {
        const id = req.payload?.id
        if (!id) throw new Error("Can't get the role from jwt payload");

        const user = await findUserById(id);
        if (!user) return next(new NotFoundError());
        
        if (user.role == roles.admin) next();
        else next(new ForbiddenError());
    } catch (error) {
        loggers.error(error);
        next(new InternalServerError());
    }
}

