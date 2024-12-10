import { Request, Response } from "express";
import { User, userReqBody } from "../types";
import { generateId, getEncryptedPassword } from "../config";
import { insertUser } from "../services";



export const signup = async(req: Request<{}, any, userReqBody>, res: Response) => {
    try {
        const { email, password, role, username } = req.body;
        if (typeof email !== 'string' || typeof password !== 'string' || typeof username !== 'string' || role !== 'admin' && role !== 'user') {
            res.status(400).json({ error: 'Invalid Request Body', message: 'Please setup request body properly' });
            return;
        }

        const hashPassword = await getEncryptedPassword(password);
        const newUser:User = {
            id:generateId(),
            username,
            email,
            hashPassword,
            role,
        }

        await insertUser(newUser);
        res.statusMessage="Signup Successfull";
        res.status(200).json({message:'New user Account Created', ResponseData:{username,email}});

    } catch (error) {
        res.send(error);
    }
}


export const login = () => {

}