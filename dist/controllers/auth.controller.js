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
exports.logout = exports.refreshToken = exports.login = exports.signup = void 0;
const types_1 = require("../types");
const config_1 = require("../config");
const services_1 = require("../services");
const winston_1 = require("../utils/winston");
const user_validation_1 = require("../validations/user.validation");
const errors_1 = require("../errors");
const signup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isValidReqBody = (0, user_validation_1.validateSignupBody)(req.body);
        if (!isValidReqBody)
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
            role: types_1.roles.user,
        };
        yield (0, services_1.insertUser)(newUser);
        res.statusMessage = "Signup Successfull";
        res.status(200).json({ message: 'New Account Created Successfully', ResponseData: { id, username, email } });
    }
    catch (error) {
        winston_1.loggers.error(error);
        next(new errors_1.InternalServerError());
    }
});
exports.signup = signup;
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isValidReqBody = (0, user_validation_1.validateLoginBody)(req.body);
        if (!isValidReqBody)
            return next(new errors_1.BadRequestError());
        const { email, password } = req.body;
        const existingUser = yield (0, services_1.findUserByMail)(email);
        if (!existingUser) {
            res.status(404).json({ error: "user not found", message: 'Please try to login with a valid mail id' });
            return;
        }
        const isVerifiedPassword = (0, config_1.verifyPassword)(password, existingUser.hashPassword);
        if (!isVerifiedPassword) {
            res.status(401).json({ error: "Invalid Password", message: "Please try to request with a valid password" });
            return;
        }
        const AccessToken = yield (0, config_1.signAccessToken)(existingUser.id, existingUser.role);
        const RefreshToken = yield (0, config_1.signRefreshToken)(existingUser.id, existingUser.role);
        existingUser.refreshToken = RefreshToken;
        (0, services_1.updateUserById)(existingUser.id, existingUser);
        res.cookie('jwt', RefreshToken, { httpOnly: true, maxAge: 12 * 30 * 24 * 60 * 60 * 1000 });
        res.statusMessage = "Login Successfull";
        res.status(200).json({
            message: 'Login Successfull',
            auth: true,
            AccessToken,
            RefreshToken
        });
    }
    catch (error) {
        winston_1.loggers.error(error);
        next(new errors_1.InternalServerError());
    }
});
exports.login = login;
const refreshToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cookies = req.cookies;
        if (!(cookies === null || cookies === void 0 ? void 0 : cookies.jwt))
            return next(new errors_1.AuthenticationError());
        const RefreshToken = cookies.jwt;
        const existingUser = yield (0, services_1.findUserByRefreshToken)(RefreshToken);
        if (!existingUser)
            return next(new errors_1.NotFoundError());
        const refreshTokenPayload = yield (0, config_1.verifyRefreshToken)(RefreshToken);
        if (!refreshTokenPayload)
            return next(new errors_1.AuthenticationError());
        if ((refreshTokenPayload === null || refreshTokenPayload === void 0 ? void 0 : refreshTokenPayload.id) !== existingUser.id)
            return next(new errors_1.AuthenticationError());
        const AccessToken = yield (0, config_1.signAccessToken)(existingUser.id, existingUser.role);
        const newRefreshToken = yield (0, config_1.signRefreshToken)(existingUser.id, existingUser.role);
        existingUser.refreshToken = newRefreshToken;
        (0, services_1.updateUserById)(existingUser.id, existingUser);
        res.cookie('jwt', newRefreshToken, { httpOnly: true, maxAge: 12 * 30 * 24 * 60 * 60 * 1000 });
        res.statusMessage = "Refreshed";
        res.status(200).json({ AccessToken, RefreshToken: newRefreshToken });
    }
    catch (error) {
        winston_1.loggers.error(error);
        next(new errors_1.InternalServerError());
    }
});
exports.refreshToken = refreshToken;
const logout = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const AccessToken = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
        if (!AccessToken)
            return next(new errors_1.InternalServerError());
        const cookies = req.cookies;
        if (!(cookies === null || cookies === void 0 ? void 0 : cookies.jwt))
            return next(new errors_1.AuthenticationError());
        const RefreshToken = cookies.jwt;
        const existingUser = yield (0, services_1.findUserByRefreshToken)(RefreshToken);
        if (!existingUser)
            return next(new errors_1.NotFoundError());
        const isBlacklisted = yield (0, config_1.blackListToken)(AccessToken);
        winston_1.loggers.info(isBlacklisted);
        if (!isBlacklisted)
            return next(new errors_1.InternalServerError());
        const isRefreshTokenFoundAndDeleted = yield (0, services_1.deleteRefreshTokenOfUser)(existingUser.id);
        if (!isRefreshTokenFoundAndDeleted)
            return next(new errors_1.NotFoundError());
        res.clearCookie('jwt', { httpOnly: true });
        res.statusMessage = "Logout Successfull";
        res.status(200).json({ message: 'Succsessfully completed your logout with invalidation of accesstoken' });
    }
    catch (error) {
        winston_1.loggers.error(error);
        next(new errors_1.InternalServerError());
    }
});
exports.logout = logout;
