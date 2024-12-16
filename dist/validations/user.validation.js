"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUpdateUserByAdminBody = exports.validateUpdateUserBody = exports.validateLoginBody = exports.validateSignupBody = void 0;
const validateSignupBody = (reqBody) => {
    if (typeof reqBody !== 'object' || reqBody === null)
        return false;
    const { email, username, password } = reqBody;
    if (typeof username !== 'string' || typeof password !== 'string' || typeof email !== 'string')
        return false;
    else
        return true;
};
exports.validateSignupBody = validateSignupBody;
const validateLoginBody = (reqBody) => {
    if (typeof reqBody !== 'object' ||
        reqBody === null)
        return false;
    const { email, password } = reqBody;
    if (typeof email !== 'string' ||
        typeof password !== 'string')
        return false;
    else
        return true;
};
exports.validateLoginBody = validateLoginBody;
const validateUpdateUserBody = (reqBody) => {
    if (typeof reqBody !== 'object' ||
        reqBody === null)
        return false;
    const { currentPassword, updatedEmail, updatedPassword, updatedUsername } = reqBody;
    if (typeof currentPassword !== 'string' ||
        (typeof updatedPassword !== 'string' &&
            typeof updatedEmail !== 'string' &&
            typeof updatedUsername !== 'string'))
        return false;
    else
        return true;
};
exports.validateUpdateUserBody = validateUpdateUserBody;
const validateUpdateUserByAdminBody = (reqBody) => {
    if (typeof reqBody !== 'object' ||
        reqBody === null)
        return false;
    const { email, username, password } = reqBody;
    if (email && typeof email !== 'string' ||
        password && typeof password !== 'string' ||
        email && typeof email !== 'string')
        return false;
    else
        return true;
};
exports.validateUpdateUserByAdminBody = validateUpdateUserByAdminBody;
