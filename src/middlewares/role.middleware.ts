import { NextFunction, Request, Response } from "express";
import { customRequestWithPayload, signupBody } from "../types";
import { loggers } from "../utils/winston.util";



export const adminCheck = async (req: customRequestWithPayload, res: Response, next: NextFunction) => {
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

export const userCheck = async (req: customRequestWithPayload, res: Response, next: NextFunction) => {
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

export const setAdmin = async (req: Request<{},any,signupBody>, res: Response, next: NextFunction)=>{
    try {
        req.body.role='admin';
        next();
    } catch (error:any) {
        loggers.error(error);
        res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
}

export const setUser = async (req: Request<{}, any, signupBody>, res: Response, next: NextFunction) => {
    try {
        req.body.role = 'user';
        next();
    } catch (error: any) {
        loggers.error(error);
        res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
}