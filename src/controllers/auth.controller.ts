import { NextFunction, Request, Response } from "express";
import { User, authBody, customRequestWithPayload, roles } from "../types";
import { generateId, getEncryptedPassword, verifyPassword, signAccessToken, signRefreshToken, verifyRefreshToken, blackListToken } from "../config";
import { deleteRefreshTokenOfUser, findUserByMail, findUserByRefreshToken, insertUser, updateUserById } from "../services";
import { loggers } from "../utils/winston";
import { validateLoginBody, validateSignupBody } from "../validations/user.validation";
import { AuthenticationError, InternalServerError, NotFoundError, BadRequestError, ConflictError, RersourceNotFoundError, PasswordAuthenticationError } from "../errors";



export const signup = async (req: customRequestWithPayload<{}, any, authBody>, res: Response, next: NextFunction) => {
    try {

        const isValidReqBody = validateSignupBody(req.body);
        if (!isValidReqBody) return next(new BadRequestError());

        const { email, password, username } = req.body;

        const existingUser = await findUserByMail(email);
        if (existingUser) return next(new ConflictError());

        const hashPassword = await getEncryptedPassword(password);
        const id = await generateId();
        const newUser: User = {
            id,
            username,
            email,
            hashPassword,
            role: roles.user,
        }

        await insertUser(newUser);
        res.statusMessage = "Signup Successfull";
        res.status(200).json({ message: 'New Account Created Successfully', ResponseData: { id, username, email } });

    } catch (error) {
        loggers.error(error);
        next(new InternalServerError());
    }
}

export const login = async (req: customRequestWithPayload<{}, any, Omit<authBody, 'username'>>, res: Response, next: NextFunction) => {
    try {

        const isValidReqBody = validateLoginBody(req.body);
        if (!isValidReqBody) return next(new BadRequestError());

        const { email, password } = req.body;

        const existingUser = await findUserByMail(email);
        if (!existingUser) return next(new RersourceNotFoundError());

        const isVerifiedPassword = verifyPassword(password, existingUser.hashPassword);
        if (!isVerifiedPassword) return next(new PasswordAuthenticationError());

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
    } catch (error) {
        loggers.error(error);
        next(new InternalServerError());
    }
}

export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const cookies = req.cookies;
        if (!cookies?.jwt) return next(new AuthenticationError());
        const RefreshToken: any = cookies.jwt;
        const existingUser = await findUserByRefreshToken(RefreshToken);
        if (!existingUser) return next(new NotFoundError())

        const refreshTokenPayload = await verifyRefreshToken(RefreshToken);
        if (!refreshTokenPayload) return next(new AuthenticationError());

        if (refreshTokenPayload?.id !== existingUser.id) return next(new AuthenticationError());

        const AccessToken = await signAccessToken(existingUser.id, existingUser.role);
        const newRefreshToken = await signRefreshToken(existingUser.id, existingUser.role);
        existingUser.refreshToken = newRefreshToken;
        updateUserById(existingUser.id, existingUser);

        res.cookie('jwt', newRefreshToken, { httpOnly: true, maxAge: 12 * 30 * 24 * 60 * 60 * 1000 });
        res.statusMessage = "Refreshed";
        res.status(200).json({ AccessToken, RefreshToken: newRefreshToken });
    } catch (error) {
        loggers.error(error);
        next(new InternalServerError());
    }
}

export const logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const AccessToken = req.headers.authorization?.split(' ')[1];
        if (!AccessToken) return next(new InternalServerError());


        const cookies = req.cookies;
        if (!cookies?.jwt) return next(new AuthenticationError());
        const RefreshToken: any = cookies.jwt;
        const existingUser = await findUserByRefreshToken(RefreshToken);
        if (!existingUser) return next(new NotFoundError());

        const isBlacklisted = await blackListToken(AccessToken);
        loggers.info(isBlacklisted);
        if (!isBlacklisted) return next(new InternalServerError());

        const isRefreshTokenFoundAndDeleted = await deleteRefreshTokenOfUser(existingUser.id);
        if (!isRefreshTokenFoundAndDeleted) return next(new NotFoundError());

        res.clearCookie('jwt', { httpOnly: true })
        res.statusMessage = "Logout Successfull";
        res.status(200).json({ message: 'Succsessfully completed your logout with invalidation of accesstoken' });
    } catch (error: any) {
        loggers.error(error);
        next(new InternalServerError());
    }
}

