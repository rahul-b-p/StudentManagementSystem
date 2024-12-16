"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUserByAdmin = exports.deleteUser = exports.updateUserByAdmin = exports.updateUser = exports.readAllAdmins = exports.readAllUsers = exports.createAdmin = void 0;
const services_1 = require("../services");
const winston_util_1 = require("../utils/winston.util");
const config_1 = require("../config");
const validations_1 = require("../validations");
const createAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isValidReqBody = (0, validations_1.validateSignupBody)(req.body);
        if (!isValidReqBody) {
            res.status(400).json({ error: 'Invalid Request Body', message: 'Please setup request body properly' });
            return;
        }
        const { email, password, username } = req.body;
        const existingUser = yield (0, services_1.findUserByMail)(email);
        if (existingUser) {
            res.status(409).json({ message: "user already exists" });
            return;
        }
        const hashPassword = yield (0, config_1.getEncryptedPassword)(password);
        const id = yield (0, config_1.generateId)();
        const newUser = {
            id,
            username,
            email,
            hashPassword,
            role: 'admin',
        };
        yield (0, services_1.insertUser)(newUser);
        res.statusMessage = "New admin created";
        res.status(200).json({ message: 'New Admin Created Successfully', ResponseData: { id, username, email } });
    }
    catch (error) {
        winston_util_1.loggers.error(error);
        res.status(500).json({ message: "Something went wrong", error: error.message });
    }
});
exports.createAdmin = createAdmin;
const readAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const id = (_a = req.payload) === null || _a === void 0 ? void 0 : _a.id;
        if (!id)
            throw new Error("Couldn't find payload");
        const existingUser = yield (0, services_1.findUserById)(id);
        if (!existingUser) {
            res.status(404).json({ error: 'Requested with an Invalid UserId' });
            return;
        }
        const users = yield (0, services_1.findUsersByrole)('user');
        const ResponseData = users.map(({ id, username, email }) => ({ id, email, username }));
        res.status(200).json({ message: "Found all users", ResponseData });
    }
    catch (error) {
        winston_util_1.loggers.error(error);
        res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
});
exports.readAllUsers = readAllUsers;
const readAllAdmins = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const id = (_a = req.payload) === null || _a === void 0 ? void 0 : _a.id;
        if (!id)
            throw new Error("Couldn't find payload");
        const existingUser = yield (0, services_1.findUserById)(id);
        if (!existingUser) {
            res.status(404).json({ error: 'Requested with an Invalid UserId' });
            return;
        }
        const admins = yield (0, services_1.findUsersByrole)('admin');
        const ResponseData = admins.map(({ id, username, email }) => ({ id, email, username }));
        res.status(200).json({ message: "Found all users", ResponseData });
    }
    catch (error) {
        winston_util_1.loggers.error(error);
        res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
});
exports.readAllAdmins = readAllAdmins;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const isValidReqBody = (0, validations_1.validateUpdateUserBody)(req.body);
        if (!isValidReqBody) {
            res.status(400).json({ error: 'Invalid Request Body' });
            return;
        }
        const { currentPassword, updatedPassword, updatedEmail, updatedUsername } = req.body;
        const id = (_a = req.payload) === null || _a === void 0 ? void 0 : _a.id;
        if (!id)
            throw new Error("Couldn't find payload");
        const existingUser = yield (0, services_1.findUserById)(id);
        if (!existingUser) {
            res.status(404).json({ error: 'Requested with an Invalid UserId' });
            return;
        }
        const isVerifiedPassword = yield (0, config_1.verifyPassword)(currentPassword, existingUser.hashPassword);
        if (!isVerifiedPassword) {
            res.status(400).json({ messege: 'Entered Password is InCorrect, please check' });
            return;
        }
        existingUser.hashPassword = updatedPassword ? yield (0, config_1.getEncryptedPassword)(updatedPassword) : existingUser.hashPassword;
        existingUser.email = updatedEmail ? updatedEmail : existingUser.email;
        existingUser.username = updatedUsername ? updatedUsername : existingUser.username;
        yield (0, services_1.updateUserById)(id, existingUser);
        res.statusMessage = "Updated Successfully";
        res.status(200).json({ messege: 'user updated successfully', body: { username: existingUser.username, email: existingUser.email } });
    }
    catch (error) {
        winston_util_1.loggers.error(error);
        res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
});
exports.updateUser = updateUser;
const updateUserByAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const isValidReqBody = (0, validations_1.validateUpdateUserByAdminBody)(req.body);
        if (!isValidReqBody) {
            res.status(400).json({ error: 'Invalid Request Body' });
            return;
        }
        const userId = (_a = req.payload) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId)
            throw new Error("Couldn't find payload");
        const existingUser = yield (0, services_1.findUserById)(userId);
        if (!existingUser) {
            res.status(404).json({ error: 'Requested with an Invalid UserId' });
            return;
        }
        const { id } = req.params;
        const { email, password, username } = req.body;
        const updatingUser = yield (0, services_1.findUserById)(id);
        if (!updatingUser) {
            res.status(404).json({ message: 'Not found any user for deletion' });
            return;
        }
        updatingUser.hashPassword = password ? yield (0, config_1.getEncryptedPassword)(password) : updatingUser.hashPassword;
        updatingUser.email = email ? email : updatingUser.email;
        updatingUser.username = username ? username : updatingUser.username;
        const result = yield (0, services_1.updateUserById)(id, updatingUser);
        if (result) {
            res.statusMessage = "Updated Successfully";
            res.status(200).json({ messege: 'user updated successfully', body: { username: updatingUser.username, email: updatingUser.email } });
        }
        else {
            res.status(404).json({ message: 'Not found any user for deletion' });
        }
    }
    catch (error) {
        winston_util_1.loggers.error(error);
        res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
});
exports.updateUserByAdmin = updateUserByAdmin;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const id = (_a = req.payload) === null || _a === void 0 ? void 0 : _a.id;
        if (!id)
            throw new Error("Couldn't find payload");
        const existingUser = yield (0, services_1.findUserById)(id);
        if (!existingUser) {
            res.status(401).json({ messege: 'You are requested from an invalid user id' });
            return;
        }
        const accessToken = (_b = req.headers.authorization) === null || _b === void 0 ? void 0 : _b.split(' ')[1];
        if (accessToken) {
            const isBlacklistedAccess = yield (0, config_1.blackListToken)(accessToken);
            const isBlacklilstedRefresh = existingUser.refreshToken ? yield (0, config_1.blackListToken)(existingUser.refreshToken) : true;
            if (isBlacklistedAccess && isBlacklilstedRefresh) {
                yield (0, services_1.deleteUserAccount)(id);
                res.statusMessage = "Successfully Deleted";
                res.status(200).json({ message: 'Your Account has been removed successfully' });
            }
            else {
                res.status(500).json({ message: 'Account Deletion Failed Due to blacklisting your token' });
            }
        }
    }
    catch (error) {
        winston_util_1.loggers.error(error);
        res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
});
exports.deleteUser = deleteUser;
const deleteUserByAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.payload) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId)
            throw new Error("Couldn't find payload");
        const existingUser = yield (0, services_1.findUserById)(userId);
        if (!existingUser) {
            res.status(404).json({ error: 'Requested with an Invalid UserId' });
            return;
        }
        const { id } = req.params;
        const isDeleted = yield (0, services_1.deleteUserById)(id);
        if (isDeleted) {
            res.statusMessage = "Deleted Successful";
            res.status(200).json({ message: "Deleted user with given Id" });
        }
        else {
            res.status(404).json({ message: 'Not found any user for deletion' });
        }
    }
    catch (error) {
        winston_util_1.loggers.error(error);
        res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
});
exports.deleteUserByAdmin = deleteUserByAdmin;
