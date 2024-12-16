import { Response } from "express"
import { authBody, customRequestWithPayload, updateUserBody, User } from "../types"
import { deleteUserAccount, findUserById, findUserByMail, findUsersByrole, insertUser, updateUserById } from "../services";
import { loggers } from "../utils/winston.util";
import { blackListToken, generateId, getEncryptedPassword, verifyPassword } from "../config";
import { validateSignupBody, validateUpdateUserBody } from "../validations";


export const createAdmin = async (req: customRequestWithPayload<{}, any, authBody>, res: Response) => {
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
            role: 'admin',
        }

        await insertUser(newUser);
        res.statusMessage = "New admin created";
        res.status(200).json({ message: 'New Admin Created Successfully', ResponseData: { id, username, email } });

    } catch (error: any) {
        loggers.error(error);
        res.status(500).json({ message: "Something went wrong", error: error.message })
    }
}

export const readAllUsers = async (req: customRequestWithPayload, res: Response) => {
    try {
        const id = req.payload?.id;
        if (!id) throw new Error("Couldn't find payload");

        const existingUser = await findUserById(id)
        if (!existingUser) {
            res.status(404).json({ error: 'Requested with an Invalid UserId' });
            return;
        }

        const users = await findUsersByrole('user');
        type Response = Omit<User, 'hashPassword' | 'refreshToken' | 'role'>;
        const ResponseData: Response[] = users.map(({ id, username, email }) => ({ id, email, username }));
        res.status(200).json({ message: "Found all users", ResponseData });
    } catch (error: any) {
        loggers.error(error);
        res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
}

export const readAllAdmins = async (req: customRequestWithPayload, res: Response) => {
    try {
        const id = req.payload?.id;
        if (!id) throw new Error("Couldn't find payload");

        const existingUser = await findUserById(id)
        if (!existingUser) {
            res.status(404).json({ error: 'Requested with an Invalid UserId' });
            return;
        }

        const admins = await findUsersByrole('admin');
        type Response = Omit<User, 'hashPassword' | 'refreshToken' | 'role'>;
        const ResponseData: Response[] = admins.map(({ id, username, email }) => ({ id, email, username }));
        res.status(200).json({ message: "Found all users", ResponseData });
    } catch (error: any) {
        loggers.error(error);
        res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
}

export const updateUser = async (req: customRequestWithPayload<{}, any, updateUserBody>, res: Response) => {
    try {
        const isValidReqBody = validateUpdateUserBody(req.body);
        if (!isValidReqBody) {
            res.status(400).json({ error: 'Invalid Request Body' });
            return;
        }

        const { currentPassword, updatedPassword, updatedEmail, updatedUsername } = req.body;

        const id = req.payload?.id;
        if (!id) throw new Error("Couldn't find payload");

        const existingUser = await findUserById(id);
        if (!existingUser) {
            res.status(404).json({ error: 'Requested with an Invalid UserId' });
            return;
        }

        const isVerifiedPassword = await verifyPassword(currentPassword, existingUser.hashPassword);
        if (!isVerifiedPassword) {
            res.status(400).json({ messege: 'Entered Password is InCorrect, please check' });
            return;
        }
        existingUser.hashPassword = updatedPassword ? await getEncryptedPassword(updatedPassword) : existingUser.hashPassword;
        existingUser.email = updatedEmail ? updatedEmail : existingUser.email;
        existingUser.username = updatedUsername ? updatedUsername : existingUser.username;


        await updateUserById(id, existingUser);
        res.statusMessage = "Updated Successfully";
        res.status(200).json({ messege: 'user updated successfully', body: { username: existingUser.username, email: existingUser.email } })
    } catch (error: any) {
        loggers.error(error);
        res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
}

export const deleteUser = async (req: customRequestWithPayload, res: Response) => {
    try {
        const id = req.payload?.id;
        if (!id) throw new Error("Couldn't find payload");

        const existingUser = await findUserById(id);
        if (!existingUser) {
            res.status(401).json({ messege: 'You are requested from an invalid user id' });
            return;
        }

        const accessToken = req.headers.authorization?.split(' ')[1];
        if (accessToken) {
            const isBlacklistedAccess = await blackListToken(accessToken);
            const isBlacklilstedRefresh = existingUser.refreshToken ? await blackListToken(existingUser.refreshToken) : true
            if (isBlacklistedAccess && isBlacklilstedRefresh) {
                await deleteUserAccount(id);
                res.statusMessage = "Successfully Deleted";
                res.status(200).json({ message: 'Your Account has been removed successfully' });
            } else {
                res.status(500).json({ message: 'Account Deletion Failed Due to blacklisting your token' });
            }
        }
    } catch (error) {
        loggers.error(error);
        res.status(500).json({ message: 'Something went wrong', error });
    }
}