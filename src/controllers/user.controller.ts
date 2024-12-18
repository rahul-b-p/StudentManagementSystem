import { NextFunction, Response } from "express"
import { authBody, customRequestWithPayload, roles, updateUserBody, User } from "../types"
import { deleteUserAccount, deleteUserById, findUserById, findUserByMail, findUsersByrole, insertUser, updateUserById } from "../services";
import { loggers } from "../utils/winston";
import { blackListToken, generateId, getEncryptedPassword, verifyPassword } from "../config";
import { validateSignupBody, validateUpdateUserBody, validateUpdateUserByAdminBody } from "../validations";
import { InternalServerError, NotFoundError, BadRequestError, RersourceNotFoundError, ConflictError, PasswordAuthenticationError } from "../errors";
import { sendSuccessResponse } from "../utils/successResponse";




export const createUser = async (req: customRequestWithPayload<{ role: roles }, any, authBody>, res: Response, next: NextFunction) => {
    try {
        const isValidReqBody = validateSignupBody(req.body);
        if (!isValidReqBody) return next(new BadRequestError());

        const { role } = req.params;
        if (role !== roles.admin && role !== roles.user) return next(new BadRequestError());
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
            role,
        }

        await insertUser(newUser);
        res.statusMessage = "New admin created";
        res.status(200).json(await sendSuccessResponse(`New ${role} Created Successfully`, { id, username, email }));

    } catch (error) {
        loggers.error(error);
        next(new InternalServerError());
    }
}

export const readAllUsers = async (req: customRequestWithPayload, res: Response, next: NextFunction) => {
    try {
        const id = req.payload?.id;
        if (!id) throw new Error("Couldn't find payload");

        const existingUser = await findUserById(id)
        if (!existingUser) return next(new NotFoundError());

        const users = await findUsersByrole('user');
        type Response = Omit<User, 'hashPassword' | 'refreshToken' | 'role'>;
        const ResponseData: Response[] = users.map(({ id, username, email }) => ({ id, email, username }));
        res.status(200).json(await sendSuccessResponse('Fetched all users', ResponseData));
    } catch (error) {
        loggers.error(error);
        next(new InternalServerError());
    }
}

export const readAllAdmins = async (req: customRequestWithPayload, res: Response, next: NextFunction) => {
    try {
        const id = req.payload?.id;
        if (!id) throw new Error("Couldn't find payload");

        const existingUser = await findUserById(id)
        if (!existingUser) return next(new NotFoundError());

        const admins = await findUsersByrole('admin');
        type Response = Omit<User, 'hashPassword' | 'refreshToken' | 'role'>;
        const ResponseData: Response[] = admins.map(({ id, username, email }) => ({ id, email, username }));
        res.status(200).json(await sendSuccessResponse('Fetched all users with adminrole', ResponseData));
    } catch (error) {
        loggers.error(error);
        next(new InternalServerError());
    }
}

export const updateUser = async (req: customRequestWithPayload<{}, any, updateUserBody>, res: Response, next: NextFunction) => {
    try {
        const isValidReqBody = validateUpdateUserBody(req.body);
        if (!isValidReqBody) return next(new BadRequestError());

        const { currentPassword, updatedPassword, updatedEmail, updatedUsername } = req.body;

        const id = req.payload?.id;
        if (!id) throw new Error("Couldn't find payload");

        const existingUser = await findUserById(id);
        if (!existingUser) return next(new NotFoundError());
        const isVerifiedPassword = await verifyPassword(currentPassword, existingUser.hashPassword);
        if (!isVerifiedPassword) return next(new PasswordAuthenticationError());
        existingUser.hashPassword = updatedPassword ? await getEncryptedPassword(updatedPassword) : existingUser.hashPassword;
        existingUser.email = updatedEmail ? updatedEmail : existingUser.email;
        existingUser.username = updatedUsername ? updatedUsername : existingUser.username;


        await updateUserById(id, existingUser);
        res.statusMessage = "Updated Successfully";
        res.status(200).json(await sendSuccessResponse('user updated successfully', { username: existingUser.username, email: existingUser.email }))
    } catch (error) {
        loggers.error(error);
        next(new InternalServerError());
    }
}

export const updateUserByAdmin = async (req: customRequestWithPayload<{ id: string }, any, authBody>, res: Response, next: NextFunction) => {
    try {
        const isValidReqBody = validateUpdateUserByAdminBody(req.body);
        if (!isValidReqBody) return next(new BadRequestError());

        const userId = req.payload?.id;
        if (!userId) throw new Error("Couldn't find payload");

        const existingUser = await findUserById(userId);
        if (!existingUser) return next(new NotFoundError());

        const { id } = req.params;

        const { email, password, username } = req.body

        const updatingUser = await findUserById(id);
        if (!updatingUser) return next(new RersourceNotFoundError());

        updatingUser.hashPassword = password ? await getEncryptedPassword(password) : updatingUser.hashPassword
        updatingUser.email = email ? email : updatingUser.email;
        updatingUser.username = username ? username : updatingUser.username;


        const result = await updateUserById(id, updatingUser);
        if (result) {
            res.statusMessage = "Updated Successfully";
            res.status(200).json(await sendSuccessResponse('user updated successfully', { username: updatingUser.username, email: updatingUser.email }));
        }
        else return next(new RersourceNotFoundError());

    } catch (error) {
        loggers.error(error);
        next(new InternalServerError());
    }
}

export const deleteUser = async (req: customRequestWithPayload, res: Response, next: NextFunction) => {
    try {
        const id = req.payload?.id;
        if (!id) throw new Error("Couldn't find payload");

        const existingUser = await findUserById(id);
        if (!existingUser) return next(new NotFoundError());

        const accessToken = req.headers.authorization?.split(' ')[1];
        if (accessToken) {
            const isBlacklistedAccess = await blackListToken(accessToken);
            const isBlacklilstedRefresh = existingUser.refreshToken ? await blackListToken(existingUser.refreshToken) : true
            if (isBlacklistedAccess && isBlacklilstedRefresh) {
                await deleteUserAccount(id);
                res.statusMessage = "Successfully Deleted";
                res.status(200).json(await sendSuccessResponse('Your Account has been deleted successfully'));
            } else {
                next(new InternalServerError());
            }
        }
    } catch (error) {
        loggers.error(error);
        next(new InternalServerError());
    }
}

export const deleteUserByAdmin = async (req: customRequestWithPayload<{ id: string }>, res: Response, next: NextFunction) => {
    try {
        const userId = req.payload?.id;
        if (!userId) throw new Error("Couldn't find payload");

        const existingUser = await findUserById(userId);
        if (!existingUser) return next(new NotFoundError());

        const { id } = req.params;
        const isDeleted = await deleteUserById(id);

        if (isDeleted) {
            res.statusMessage = "Deleted Successful";
            res.status(200).json(await sendSuccessResponse('Deleted User with given Id'));
        }
        else return next(new RersourceNotFoundError());
    } catch (error) {
        loggers.error(error);
        next(new InternalServerError());
    }
}

