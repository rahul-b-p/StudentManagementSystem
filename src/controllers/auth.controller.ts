import { Request, Response } from "express";
import { User, authBody, customRequestWithPayload } from "../types";
import { generateId, getEncryptedPassword, verifyPassword, signAccessToken, signRefreshToken, verifyRefreshToken, blackListToken } from "../config";
import { deleteRefreshTokenOfUser, findUserByMail, findUserByRefreshToken, insertUser, updateUserById } from "../services";
import { loggers } from "../utils/winston.util";
import { validateLoginBody, validateSignupBody } from "../validations/user.validation";



export const signup = async (req: customRequestWithPayload<{}, any, authBody>, res: Response) => {
    try {

        const isValidReqBody = validateSignupBody(req.body);
        if (!isValidReqBody) {
            res.status(400).json({ error: 'Invalid Request Body', message: 'Please setup request body properly' });
            return;
        }

        const { email, password, username } = req.body;

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
            role: 'user',
        }

        await insertUser(newUser);
        res.statusMessage = "Signup Successfull";
        res.status(200).json({ message: 'New Account Created Successfully', ResponseData: { id, username, email } });

    } catch (error: any) {
        loggers.error(error);
        res.status(500).json({ message: "Something went wrong", error: error.message })
    }
}

export const login = async (req: customRequestWithPayload<{}, any, Omit<authBody, 'username'>>, res: Response) => {
    try {

        const isValidReqBody = validateLoginBody(req.body);
        if (!isValidReqBody) {
            res.status(400).json({ error: 'Invalid Request Body', message: 'Please setup request body properly' });
            return;
        }

        const { email, password } = req.body;

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

        existingUser.refreshToken = RefreshToken;
        updateUserById(existingUser.id, existingUser)

        res.cookie('jwt', RefreshToken, { httpOnly: true, maxAge: 12 * 30 * 24 * 60 * 60 * 1000 });
        res.statusMessage = "Login Successfull";
        res.status(200).json({
            message: 'Login Successfull',
            auth: true,
            AccessToken,
            RefreshToken
        })
    } catch (error: any) {
        loggers.error(error);
        res.status(500).json({ message: "Something went wrong", error: error.message })
    }
}

export const refreshToken = async (req: Request, res: Response) => {
    try {
        const cookies = req.cookies;
        if (!cookies?.jwt) {
            res.status(401).json({ error: "refersh token not found on the request" });
            return;
        }
        const RefreshToken: any = cookies.jwt;
        const existingUser = await findUserByRefreshToken(RefreshToken);
        if (!existingUser) {
            res.status(404).json({ error: "Not found a user with requested refresh token" });
            return;
        }

        const refreshTokenPayload = await verifyRefreshToken(RefreshToken);
        if (!refreshTokenPayload) {
            res.status(401).json({ error: 'Unauthorized Request' });
            return;
        }

        if (refreshTokenPayload?.id !== existingUser.id) {
            res.status(401).json({ error: 'Unauthorized Request' });
            return;
        }

        const AccessToken = await signAccessToken(existingUser.id, existingUser.role);
        const newRefreshToken = await signRefreshToken(existingUser.id, existingUser.role);
        existingUser.refreshToken = newRefreshToken;
        updateUserById(existingUser.id, existingUser);

        res.cookie('jwt', newRefreshToken, { httpOnly: true, maxAge: 12 * 30 * 24 * 60 * 60 * 1000 });
        res.statusMessage = "Refreshed";
        res.status(200).json({ AccessToken, RefreshToken: newRefreshToken });
    } catch (error: any) {
        loggers.error(error);
        res.status(500).json({ message: 'Something went wrong while refreshing the token' });
    }
}

export const logout = async (req: Request, res: Response) => {
    try {
        const AccessToken = req.headers.authorization?.split(' ')[1];
        if (!AccessToken) {
            res.status(500).json({ error: 'Logout failed due to misssing of access token' });
            return;
        };


        const cookies = req.cookies;
        if (!cookies?.jwt) {
            res.status(401).json({ error: "refersh token not found on the request" });
            return;
        }
        const RefreshToken: any = cookies.jwt;
        const existingUser = await findUserByRefreshToken(RefreshToken);
        if (!existingUser) {
            res.status(404).json({ error: "Not found a user with requested refresh token" });
            return;
        }

        const isBlacklisted = await blackListToken(AccessToken);
        loggers.info(isBlacklisted);
        if (!isBlacklisted) {
            res.status(500).json({ message: 'Failed to blacklist token' });
            return;
        }

        const isRefreshTokenFoundAndDeleted = await deleteRefreshTokenOfUser(existingUser.id);
        if (!isRefreshTokenFoundAndDeleted) {
            res.status(404).json({ error: "UserId not match with any user to delete this account" });
            return;
        }

        res.clearCookie('jwt', { httpOnly: true })
        res.statusMessage = "Logout Successfull";
        res.status(200).json({ message: 'Succsessfully completed your logout with invalidation of accesstoken' });
    } catch (error: any) {
        loggers.error(error);
        res.status(500).json({ message: 'Something went wrong while loggging out', error: error.message });
    }
}

