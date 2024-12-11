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
exports.JwtAuthMiddleware = void 0;
const winston_util_1 = require("../utils/winston.util");
const config_1 = require("../config");
const JwtAuthMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const AccessToken = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
        if (!AccessToken) {
            res.status(400).json({ error: 'Authorization failed due to inavailability of access token', message: 'add your token for authorization' });
            return;
        }
        const isJwtBlacklisted = yield (0, config_1.checkTokenBlacklist)(AccessToken);
        if (isJwtBlacklisted) {
            res.status(400).json({ error: 'Invalid token' });
            return;
        }
        const tokenPayload = yield (0, config_1.verifyAccessToken)(AccessToken);
        const { id, role } = tokenPayload;
        req.payload = {
            id,
            role
        };
        next();
    }
    catch (error) {
        winston_util_1.loggers.error(error);
        res.status(401).json({ error: 'unAuthorized', message: 'You are requested from unauthorized access' });
    }
});
exports.JwtAuthMiddleware = JwtAuthMiddleware;
