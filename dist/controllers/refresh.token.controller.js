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
exports.refreshToken = void 0;
const services_1 = require("../services");
const winston_util_1 = require("../utils/winston.util");
const config_1 = require("../config");
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
        const AccessToken = (0, config_1.signAccessToken)(existingUser.id, existingUser.role);
        res.status(200).json({ AccessToken });
    }
    catch (error) {
        winston_util_1.loggers.error(error);
        res.status(500).json({ message: 'Something went wrong while refreshing the token' });
    }
});
exports.refreshToken = refreshToken;
