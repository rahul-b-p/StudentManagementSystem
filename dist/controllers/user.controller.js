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
exports.deleteUser = exports.updateUser = exports.readAllAdmins = exports.readAllUsers = void 0;
const services_1 = require("../services");
const winston_util_1 = require("../utils/winston.util");
const config_1 = require("../config");
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
        const { currentPassword, updatedPassword, updatedEmail, updatedUsername } = req.body;
        if (typeof currentPassword !== 'string' || (typeof updatedPassword !== 'string' && typeof updatedEmail !== 'string' && typeof updatedUsername !== 'string')) {
            res.status(400).json({ error: 'Invalid Request Body' });
            return;
        }
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
const deleteUser = () => {
};
exports.deleteUser = deleteUser;
