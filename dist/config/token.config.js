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
exports.checkTokenBlacklist = exports.blackListToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const redis_util_1 = __importDefault(require("../utils/redis.util"));
const winston_util_1 = require("../utils/winston.util");
const blackListToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { exp } = jsonwebtoken_1.default.decode(token);
        const expiresIn = exp - Math.floor(Date.now() / 1000);
        const result = yield redis_util_1.default.set(token, 'Blacklisted', { 'EX': expiresIn });
        return result;
    }
    catch (error) {
        winston_util_1.loggers.error(error);
        throw new Error("Can't Blacklist Token");
    }
});
exports.blackListToken = blackListToken;
const checkTokenBlacklist = (token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield redis_util_1.default.get(token);
        return result;
    }
    catch (error) {
        winston_util_1.loggers.error(error);
        throw new Error("Can't check the token now");
    }
});
exports.checkTokenBlacklist = checkTokenBlacklist;
