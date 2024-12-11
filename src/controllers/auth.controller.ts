import { Request, Response } from "express";
import { User, loginBody, signupBody } from "../types";
import { generateId, getEncryptedPassword, verifyPassword, signAccessToken, signRefreshToken } from "../config";
import { findUserByMail, insertUser } from "../services";
import { loggers } from "../utils/winston.util";



export const signup = async (req: Request<{}, any, signupBody>, res: Response) => {
    try {
        const { email, password, role, username } = req.body;
        if (typeof email !== 'string' || typeof password !== 'string' || typeof username !== 'string' || role !== 'admin' && role !== 'user') {
            res.status(400).json({ error: 'Invalid Request Body', message: 'Please setup request body properly' });
            return;
        }

        const existingUser = await findUserByMail(email);
        if (existingUser) {
            res.status(409).json({ message: "user already exists" });
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

    } catch (error: any) {
        loggers.error(error);
        res.status(500).json({ message: "Something went wrong", error: error.message })
    }
}


export const login = async (req: Request<{}, any, loginBody>, res: Response) => {
    try {
        const { email, password } = req.body;
        if (typeof email !== 'string' || typeof password !== 'string') {
            res.status(400).json({ error: 'Invalid Request Body', message: 'Please setup request body properly' });
            return;
        }

        const existingUser = await findUserByMail(email);
        if (!existingUser) {
            res.status(404).json({ error: "user not found", message: 'Please try to login with a valid mail id' });
            return;
        }

        const isVerifiedPassword = verifyPassword(password, existingUser.hashPassword);
        if (!isVerifiedPassword) {
            res.status(401).json({ error: "Invalid Password", message: "Please try to request with a valid password" });
            return;
        }

        const AccessToken = await signAccessToken(existingUser.id, existingUser.role);
        const RefreshToken = await signRefreshToken(existingUser.id, existingUser.role);

        res.cookie('jwt', RefreshToken, { httpOnly: true, maxAge: 12 * 30 * 24 * 60 * 60 * 1000 });
        res.statusMessage = "Login Successfull";
        res.status(200).json({
            message: 'Login Successfull',
            auth: true,
            AccessToken
        })
    } catch (error) {

    }
}