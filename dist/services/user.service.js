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
exports.deleteRefreshTokenOfUser = exports.updateUserById = exports.insertUser = exports.saveUsers = exports.findUserByRefreshToken = exports.findUserByMail = exports.findUserById = exports.findUsers = void 0;
const winston_util_1 = require("../utils/winston.util");
const file_service_1 = require("./file.service");
const findUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield (0, file_service_1.readData)();
        const { users } = data;
        return users;
    }
    catch (error) {
        winston_util_1.loggers.error(error);
        throw new Error("Can't find users due to an error");
    }
});
exports.findUsers = findUsers;
const findUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield (0, exports.findUsers)();
        const user = users.find(item => item.id == id);
        return user ? user : null;
    }
    catch (error) {
        winston_util_1.loggers.error(error);
        throw new Error("Can't find Users with given id due to an error");
    }
});
exports.findUserById = findUserById;
const findUserByMail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield (0, exports.findUsers)();
        const user = users.find(item => item.email == email);
        return user ? user : null;
    }
    catch (error) {
        winston_util_1.loggers.error(error);
        throw new Error("Can't find Users with given email due to an error");
    }
});
exports.findUserByMail = findUserByMail;
const findUserByRefreshToken = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield (0, exports.findUsers)();
        const user = users.find(item => item.refreshToken == refreshToken);
        return user ? user : null;
    }
    catch (error) {
        winston_util_1.loggers.error(error);
        throw new Error("Can't find Users with requested RefreshToken due to an error");
    }
});
exports.findUserByRefreshToken = findUserByRefreshToken;
const saveUsers = (newUsers) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield (0, file_service_1.readData)();
        data.users = newUsers;
        yield (0, file_service_1.writeData)(data);
        return true;
    }
    catch (error) {
        winston_util_1.loggers.error(error);
        throw new Error("Can't save users on Database due to an error");
    }
});
exports.saveUsers = saveUsers;
const insertUser = (newUser) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield (0, exports.findUsers)();
        users.push(newUser);
        yield (0, exports.saveUsers)(users);
        return true;
    }
    catch (error) {
        winston_util_1.loggers.error(error);
        throw new Error("Can't insert user on Users due to an error");
    }
});
exports.insertUser = insertUser;
const updateUserById = (id, updatedUser) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield (0, exports.findUsers)();
        const updateIndex = users.findIndex(item => item.id == id);
        if (updateIndex == -1)
            return false;
        else {
            users[updateIndex] = updatedUser;
            yield (0, exports.saveUsers)(users);
            return true;
        }
    }
    catch (error) {
        winston_util_1.loggers.error(error);
        throw new Error("Can't update user with given id due to an error");
    }
});
exports.updateUserById = updateUserById;
const deleteRefreshTokenOfUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield (0, exports.findUserById)(id);
        if (!user) {
            return false;
        }
        user.refreshToken = undefined;
        (0, exports.updateUserById)(id, user);
        return true;
    }
    catch (error) {
        winston_util_1.loggers.error(error);
        throw new Error("Can't  delete Refresh Token Due to Error");
    }
});
exports.deleteRefreshTokenOfUser = deleteRefreshTokenOfUser;
