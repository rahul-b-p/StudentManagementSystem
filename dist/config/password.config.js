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
exports.verifyPassword = exports.getEncryptedPassword = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const winston_util_1 = require("../utils/winston.util");
const getEncryptedPassword = (password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const salt = bcrypt_1.default.genSaltSync(Number(process.env.SALT));
        const encryptedPassword = yield bcrypt_1.default.hash(password, salt);
        return encryptedPassword;
    }
    catch (error) {
        winston_util_1.loggers.error(error);
        throw new Error("An Error occur while password encryption");
    }
});
exports.getEncryptedPassword = getEncryptedPassword;
const verifyPassword = (password, hashPass) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isCorrectPassword = yield bcrypt_1.default.compare(password, hashPass);
        return isCorrectPassword;
    }
    catch (error) {
        winston_util_1.loggers.error(error);
        throw new Error("An Error occur while password verification");
    }
});
exports.verifyPassword = verifyPassword;
