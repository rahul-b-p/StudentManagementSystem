import { NextFunction, Response } from "express";
import { customRequestWithPayload } from "../types";
import { loggers } from "../utils/winston.util";



export const checkAdmin = async (req: customRequestWithPayload, res: Response, next: NextFunction) => {
    try {
        const role = req.payload?.role
        if (!role) throw new Error("Can't get the role from jwt payload");

        if (role == 'admin') next();
        else {
            res.status(400).json("Invalid Request");
            return;
        }
    } catch (error: any) {
        loggers.error(error);
        res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
}

export const checkUser = async (req: customRequestWithPayload, res: Response, next: NextFunction) => {
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

export const adminAuth = async (req: customRequestWithPayload, res: Response, next: NextFunction) => {
    try {
        req.payload = { id: '', role: 'admin' };
        next();
    } catch (error: any) {
        loggers.error(error);
        res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
}

export const userAuth = async (req: customRequestWithPayload, res: Response, next: NextFunction) => {
    try {
        req.payload = { id: '', role: 'user' };
        next();
    } catch (error: any) {
        loggers.error(error);
        res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
}