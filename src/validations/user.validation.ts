import { authBody, updateUserBody } from "../types";



export const validateSignupBody = (reqBody: authBody) => {
    if (typeof reqBody !== 'object' || reqBody === null) return false;

    const { email, username, password } = reqBody;

    if (typeof username !== 'string' || typeof password !== 'string' || typeof email !== 'string') return false;
    else return true;
}

export const validateLoginBody = (reqBody: Omit<authBody, 'username'>) => {
    if (typeof reqBody !== 'object' ||
        reqBody === null) return false;

    const { email, password } = reqBody;

    if (typeof email !== 'string' ||
        typeof password !== 'string') return false;
    else return true;
}

export const validateUpdateUserBody = (reqBody: updateUserBody) => {
    if (typeof reqBody !== 'object' ||
        reqBody === null) return false;
    const { currentPassword, updatedEmail, updatedPassword, updatedUsername } = reqBody;
    if (typeof currentPassword !== 'string' ||
        (typeof updatedPassword !== 'string' &&
            typeof updatedEmail !== 'string' &&
            typeof updatedUsername !== 'string')) return false;
    else return true;
}
