import { NextFunction, Response } from "express";
import { customRequestWithPayload } from "../types";
import { loggers } from "../utils/winston.util";
import { findUserById } from "../services";



export const checkAdmin = async (req: customRequestWithPayload, res: Response, next: NextFunction) => {
    try {
        const id = req.payload?.id
        if (!id) throw new Error("Can't get the role from jwt payload");

        const user = await findUserById(id);
        if(!user){
            res.status(404).json({ error: 'Requested with an Invalid UserId' });
            return;
        }
        if (user.role == 'admin') next();
        else {
            res.status(403).json({
                "error": "Forbidden",
                "message": "You do not have the necessary permissions to access this resource."
            });
            return;
        }
    } catch (error: any) {
        loggers.error(error);
        res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
}

