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
exports.deleteUserByAdmin = exports.deleteUser = exports.updateUserByAdmin = exports.updateUser = exports.readAllAdmins = exports.readAllUsers = exports.createUser = void 0;
const types_1 = require("../types");
const services_1 = require("../services");
const winston_1 = require("../utils/winston");
const config_1 = require("../config");
const validations_1 = require("../validations");
const errors_1 = require("../errors");
const successResponse_1 = require("../utils/successResponse");
const createUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isValidReqBody = (0, validations_1.validateSignupBody)(req.body);
        if (!isValidReqBody)
            return next(new errors_1.BadRequestError());
        const { role } = req.params;
        if (role !== types_1.roles.admin && role !== types_1.roles.user)
            return next(new errors_1.BadRequestError());
        const { email, password, username } = req.body;
        const existingUser = yield (0, services_1.findUserByMail)(email);
        if (existingUser)
            return next(new errors_1.ConflictError());
        const hashPassword = yield (0, config_1.getEncryptedPassword)(password);
        const id = yield (0, config_1.generateId)();
        const newUser = {
            id,
            username,
            email,
            hashPassword,
            role,
        };
        yield (0, services_1.insertUser)(newUser);
        res.statusMessage = "New admin created";
        res.status(200).json(yield (0, successResponse_1.sendSuccessResponse)(`New ${role} Created Successfully`, { id, username, email }));
    }
    catch (error) {
        winston_1.loggers.error(error);
        next(new errors_1.InternalServerError());
    }
});
exports.createUser = createUser;
const readAllUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const id = (_a = req.payload) === null || _a === void 0 ? void 0 : _a.id;
        if (!id)
            throw new Error("Couldn't find payload");
        const existingUser = yield (0, services_1.findUserById)(id);
        if (!existingUser)
            return next(new errors_1.NotFoundError());
        const users = yield (0, services_1.findUsersByrole)('user');
        const ResponseData = users.map(({ id, username, email }) => ({ id, email, username }));
        res.status(200).json(yield (0, successResponse_1.sendSuccessResponse)('Fetched all users', ResponseData));
    }
    catch (error) {
        winston_1.loggers.error(error);
        next(new errors_1.InternalServerError());
    }
});
exports.readAllUsers = readAllUsers;
const readAllAdmins = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const id = (_a = req.payload) === null || _a === void 0 ? void 0 : _a.id;
        if (!id)
            throw new Error("Couldn't find payload");
        const existingUser = yield (0, services_1.findUserById)(id);
        if (!existingUser)
            return next(new errors_1.NotFoundError());
        const admins = yield (0, services_1.findUsersByrole)('admin');
        const ResponseData = admins.map(({ id, username, email }) => ({ id, email, username }));
        res.status(200).json(yield (0, successResponse_1.sendSuccessResponse)('Fetched all users with adminrole', ResponseData));
    }
    catch (error) {
        winston_1.loggers.error(error);
        next(new errors_1.InternalServerError());
    }
});
exports.readAllAdmins = readAllAdmins;
const updateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const isValidReqBody = (0, validations_1.validateUpdateUserBody)(req.body);
        if (!isValidReqBody)
            return next(new errors_1.BadRequestError());
        const { currentPassword, updatedPassword, updatedEmail, updatedUsername } = req.body;
        const id = (_a = req.payload) === null || _a === void 0 ? void 0 : _a.id;
        if (!id)
            throw new Error("Couldn't find payload");
        const existingUser = yield (0, services_1.findUserById)(id);
        if (!existingUser)
            return next(new errors_1.NotFoundError());
        const isVerifiedPassword = yield (0, config_1.verifyPassword)(currentPassword, existingUser.hashPassword);
        if (!isVerifiedPassword)
            return next(new errors_1.PasswordAuthenticationError());
        existingUser.hashPassword = updatedPassword ? yield (0, config_1.getEncryptedPassword)(updatedPassword) : existingUser.hashPassword;
        existingUser.email = updatedEmail ? updatedEmail : existingUser.email;
        existingUser.username = updatedUsername ? updatedUsername : existingUser.username;
        yield (0, services_1.updateUserById)(id, existingUser);
        res.statusMessage = "Updated Successfully";
        res.status(200).json(yield (0, successResponse_1.sendSuccessResponse)('user updated successfully', { username: existingUser.username, email: existingUser.email }));
    }
    catch (error) {
        winston_1.loggers.error(error);
        next(new errors_1.InternalServerError());
    }
});
exports.updateUser = updateUser;
const updateUserByAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const isValidReqBody = (0, validations_1.validateUpdateUserByAdminBody)(req.body);
        if (!isValidReqBody)
            return next(new errors_1.BadRequestError());
        const userId = (_a = req.payload) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId)
            throw new Error("Couldn't find payload");
        const existingUser = yield (0, services_1.findUserById)(userId);
        if (!existingUser)
            return next(new errors_1.NotFoundError());
        const { id } = req.params;
        const { email, password, username } = req.body;
        const updatingUser = yield (0, services_1.findUserById)(id);
        if (!updatingUser)
            return next(new errors_1.RersourceNotFoundError());
        updatingUser.hashPassword = password ? yield (0, config_1.getEncryptedPassword)(password) : updatingUser.hashPassword;
        updatingUser.email = email ? email : updatingUser.email;
        updatingUser.username = username ? username : updatingUser.username;
        const result = yield (0, services_1.updateUserById)(id, updatingUser);
        if (result) {
            res.statusMessage = "Updated Successfully";
            res.status(200).json(yield (0, successResponse_1.sendSuccessResponse)('user updated successfully', { username: updatingUser.username, email: updatingUser.email }));
        }
        else
            return next(new errors_1.RersourceNotFoundError());
    }
    catch (error) {
        winston_1.loggers.error(error);
        next(new errors_1.InternalServerError());
    }
});
exports.updateUserByAdmin = updateUserByAdmin;
const deleteUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const id = (_a = req.payload) === null || _a === void 0 ? void 0 : _a.id;
        if (!id)
            throw new Error("Couldn't find payload");
        const existingUser = yield (0, services_1.findUserById)(id);
        if (!existingUser)
            return next(new errors_1.NotFoundError());
        const accessToken = (_b = req.headers.authorization) === null || _b === void 0 ? void 0 : _b.split(' ')[1];
        if (accessToken) {
            const isBlacklistedAccess = yield (0, config_1.blackListToken)(accessToken);
            const isBlacklilstedRefresh = existingUser.refreshToken ? yield (0, config_1.blackListToken)(existingUser.refreshToken) : true;
            if (isBlacklistedAccess && isBlacklilstedRefresh) {
                yield (0, services_1.deleteUserAccount)(id);
                res.statusMessage = "Successfully Deleted";
                res.status(200).json(yield (0, successResponse_1.sendSuccessResponse)('Your Account has been deleted successfully'));
            }
            else {
                next(new errors_1.InternalServerError());
            }
        }
    }
    catch (error) {
        winston_1.loggers.error(error);
        next(new errors_1.InternalServerError());
    }
});
exports.deleteUser = deleteUser;
const deleteUserByAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.payload) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId)
            throw new Error("Couldn't find payload");
        const existingUser = yield (0, services_1.findUserById)(userId);
        if (!existingUser)
            return next(new errors_1.NotFoundError());
        const { id } = req.params;
        const isDeleted = yield (0, services_1.deleteUserById)(id);
        if (isDeleted) {
            res.statusMessage = "Deleted Successful";
            res.status(200).json(yield (0, successResponse_1.sendSuccessResponse)('Deleted User with given Id'));
        }
        else
            return next(new errors_1.RersourceNotFoundError());
    }
    catch (error) {
        winston_1.loggers.error(error);
        next(new errors_1.InternalServerError());
    }
});
exports.deleteUserByAdmin = deleteUserByAdmin;
