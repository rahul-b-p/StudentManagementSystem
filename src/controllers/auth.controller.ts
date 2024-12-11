import { Request, Response } from "express";
import { User, userReqBody } from "../types";
import { generateId, getEncryptedPassword } from "../config";
import { findUserByMail, insertUser } from "../services";
import { loggers } from "../utils/winston.util";



export const signup = async (req: Request<{}, any, userReqBody>, res: Response) => {
    try {
        const { email, password, role, username } = req.body;
        if (typeof email !== 'string' || typeof password !== 'string' || typeof username !== 'string' || role !== 'admin' && role !== 'user') {
            res.status(400).json({ error: 'Invalid Request Body', message: 'Please setup request body properly' });
            return;
        }

        const existingUser = await findUserByMail(email);
        if(existingUser){
            res.status(409).json({message:"user already exists"});
            return;
        }

        const hashPassword = await getEncryptedPassword(password);
        const id = await generateId();
        const newUser: User = {
            id,
            username,
            email,
            hashPassword,
            role,
        }

        await insertUser(newUser);
        res.statusMessage = "Signup Successfull";
        res.status(200).json({ message: 'New user Account Created', ResponseData: { id, username, email } });

    } catch (error:any) {
        loggers.error(error);
        res.status(500).json({message:"Something went wrong",error:error.message})
    }
}


export const login = () => {

}