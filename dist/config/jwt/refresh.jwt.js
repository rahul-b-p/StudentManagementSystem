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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signRefreshToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const winston_util_1 = require("../../utils/winston.util");
const signRefreshToken = (id, role) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const secretKey = process.env.REFRESH_TOKEN_SECRET;
        if (!secretKey) {
            throw new Error("Can't Find secret key to sign Access token");
        }
        const payload = {
            id, role
        };
        const RefreshToken = jsonwebtoken_1.default.sign(payload, secretKey, { expiresIn: '1y' });
        return RefreshToken;
    }
    catch (error) {
        winston_util_1.loggers.error(error);
        throw new Error("Can't Get Access Token");
    }
});
exports.signRefreshToken = signRefreshToken;
