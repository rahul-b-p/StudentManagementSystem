import { NextFunction, Response } from "express";
import { customRequestWithPayload } from "../types";
import { loggers } from "../utils/winston.util";



export const admin = async (req: customRequestWithPayload, res: Response, next: NextFunction) => {
    try {
        const role = req.payload?.role
        if(!role) throw new Error("Can't get the role from jwt payload");

        if(role == 'admin') next();
        else{
            res.status(400).json("Invalid Request");
            return;
        }
    } catch (error:any) {
        loggers.error(error);
        res.status(500).json({message:'Something went wrong',error:error.message});
    }
}

export const user = async (req: customRequestWithPayload, res: Response, next: NextFunction) => {
    try {
        const role = req.payload?.role
        if (!role) throw new Error("Can't get the role from jwt payload");

        if (role == 'user') next();
        else {
            res.status(400).json("Invalid Request");
            return;
        }
    } catch (error: any) {
        loggers.error(error);
        res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
}
