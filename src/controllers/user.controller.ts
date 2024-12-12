import { Response } from "express"
import { customRequestWithPayload, updateUserBody, User } from "../types"
import { findUserById, updateUserById } from "../services";
import { loggers } from "../utils/winston.util";
import { getEncryptedPassword, verifyPassword } from "../config";



export const readAllUsers = () => {
}

export const updateUser = async (req: customRequestWithPayload<{}, any, updateUserBody>, res: Response) => {
    try {
        const { currentPassword, updatedPassword, updatedEmail, updatedUsername } = req.body;
        if (typeof currentPassword !== 'string' || (typeof updatedPassword !== 'string' && typeof updatedEmail !== 'string' && typeof updatedUsername !== 'string')) {
            res.status(400).json({ error: 'Invalid Request Body' });
            return;
        }

        const id = req.payload?.id;
        if (!id) throw new Error("Couldn't find payload");

        const existingUser = await findUserById(id)
        if (!existingUser) {
            res.status(404).json({ error: 'Requested with an Invalid UserId' });
            return;
        }

        const isVerifiedPassword = await verifyPassword(currentPassword, existingUser.hashPassword);
        if (!isVerifiedPassword) {
            res.status(400).json({ messege: 'Entered Password is InCorrect, please check' });
            return;
        }
        existingUser.hashPassword= updatedPassword ? await getEncryptedPassword(updatedPassword) : existingUser.hashPassword;
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

export const deleteUser = () => {

}