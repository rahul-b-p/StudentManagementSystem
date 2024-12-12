import { User } from "../types";
import { loggers } from "../utils/winston.util";
import { readData, writeData } from "./file.service";


export const findUsers = async (): Promise<User[] | []> => {
    try {
        const data = await readData();
        const { users } = data;
        return users;
    } catch (error) {
        loggers.error(error);
        throw new Error("Can't find users due to an error");
    }
}

export const findUserById = async (id: string) => {
    try {
        const users = await findUsers();
        const user = users.find(item => item.id == id);
        return user ? user : null;
    } catch (error) {
        loggers.error(error);
        throw new Error("Can't find Users with given id due to an error");
    }
}

export const findUserByMail = async (email: string): Promise<User | null> => {
    try {
        const users = await findUsers();
        const user = users.find(item => item.email == email);
        return user ? user : null;
    } catch (error) {
        loggers.error(error);
        throw new Error("Can't find Users with given email due to an error");
    }
}

export const findUserByRefreshToken = async (refreshToken: string): Promise<User | null> => {
    try {
        const users = await findUsers();
        const user = users.find(item => item.refreshToken == refreshToken);
        return user ? user : null;
    } catch (error) {
        loggers.error(error);
        throw new Error("Can't find Users with requested RefreshToken due to an error");
    }
}

export const findUsersByrole = async (role:'admin'|'user'):Promise<User[]|[]>=>{
    try {
        const users = await findUsers();
        return users.filter(item=>item.role==role);
    } catch (error) {
        loggers.error(error);
        throw new Error("Can't find Users with given role due to an error");
    }
}

export const saveUsers = async (newUsers: User[] | []): Promise<boolean> => {
    try {
        const data = await readData();
        data.users = newUsers;
        await writeData(data);
        return true;
    } catch (error) {
        loggers.error(error);
        throw new Error("Can't save users on Database due to an error");
    }
}

export const insertUser = async (newUser: User): Promise<boolean> => {
    try {
        const users: User[] = await findUsers();
        users.push(newUser);
        await saveUsers(users);
        return true;
    } catch (error) {
        loggers.error(error);
        throw new Error("Can't insert user on Users due to an error");
    }
}

export const updateUserById = async (id: string, updatedUser: User): Promise<boolean> => {
    try {
        const users = await findUsers();
        const updateIndex = users.findIndex(item => item.id == id);
        if (updateIndex == -1) return false;
        else {
            users[updateIndex] = updatedUser;
            await saveUsers(users);
            return true;
        }
    } catch (error) {
        loggers.error(error);
        throw new Error("Can't update user with given id due to an error");
    }
}

export const deleteRefreshTokenOfUser = async (id: string):Promise<boolean> => {
    try {
        const user = await findUserById(id);
        if (!user) {
            return false;
        }
        user.refreshToken = undefined;
        updateUserById(id,user);
        return true
    } catch (error) {
        loggers.error(error);
        throw new Error("Can't  delete Refresh Token Due to Error");
    }
}
