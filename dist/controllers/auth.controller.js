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
exports.refreshToken = exports.login = exports.signup = void 0;
const config_1 = require("../config");
const services_1 = require("../services");
const winston_util_1 = require("../utils/winston.util");
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, role, username } = req.body;
        if (typeof email !== 'string' || typeof password !== 'string' || typeof username !== 'string' || role !== 'admin' && role !== 'user') {
            res.status(400).json({ error: 'Invalid Request Body', message: 'Please setup request body properly' });
            return;
        }
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
            role,
        };
        yield (0, services_1.insertUser)(newUser);
        res.statusMessage = "Signup Successfull";
        res.status(200).json({ message: 'New user Account Created', ResponseData: { id, username, email } });
    }
    catch (error) {
        winston_util_1.loggers.error(error);
        res.status(500).json({ message: "Something went wrong", error: error.message });
    }
});
exports.signup = signup;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (typeof email !== 'string' || typeof password !== 'string') {
            res.status(400).json({ error: 'Invalid Request Body', message: 'Please setup request body properly' });
            return;
        }
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
            AccessToken
        });
    }
    catch (error) {
        winston_util_1.loggers.error(error);
        res.status(500).json({ message: "Something went wrong", error: error.message });
    }
});
exports.login = login;
const refreshToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cookies = req.cookies;
        if (!(cookies === null || cookies === void 0 ? void 0 : cookies.jwt)) {
            res.status(401).json({ error: "refersh token not found on the request" });
            return;
        }
        const RefreshToken = cookies.jwt;
        const existingUser = yield (0, services_1.findUserByRefreshToken)(RefreshToken);
        if (!existingUser) {
            res.status(404).json({ error: "Not found a user with requested refresh token" });
            return;
        }
        const refreshTokenPayload = yield (0, config_1.verifyRefreshToken)(RefreshToken);
        if (!refreshTokenPayload) {
            res.status(401).json({ error: 'Unauthorized Request' });
            return;
        }
        if ((refreshTokenPayload === null || refreshTokenPayload === void 0 ? void 0 : refreshTokenPayload.id) !== existingUser.id) {
            res.status(401).json({ error: 'Unauthorized Request' });
            return;
        }
        const AccessToken = yield (0, config_1.signAccessToken)(existingUser.id, existingUser.role);
        res.status(200).json({ AccessToken });
    }
    catch (error) {
        winston_util_1.loggers.error(error);
        res.status(500).json({ message: 'Something went wrong while refreshing the token' });
    }
});
exports.refreshToken = refreshToken;
