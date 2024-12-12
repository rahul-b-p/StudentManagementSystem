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
exports.userAuth = exports.adminAuth = exports.checkUser = exports.checkAdmin = void 0;
const winston_util_1 = require("../utils/winston.util");
const checkAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const role = (_a = req.payload) === null || _a === void 0 ? void 0 : _a.role;
        if (!role)
            throw new Error("Can't get the role from jwt payload");
        if (role == 'admin')
            next();
        else {
            res.status(400).json("Invalid Request");
            return;
        }
    }
    catch (error) {
        winston_util_1.loggers.error(error);
        res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
});
exports.checkAdmin = checkAdmin;
const checkUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const role = (_a = req.payload) === null || _a === void 0 ? void 0 : _a.role;
        if (!role)
            throw new Error("Can't get the role from jwt payload");
        if (role == 'user')
            next();
        else {
            res.status(400).json("Invalid Request");
            return;
        }
    }
    catch (error) {
        winston_util_1.loggers.error(error);
        res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
});
exports.checkUser = checkUser;
const adminAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        req.payload = { id: '', role: 'admin' };
        next();
    }
    catch (error) {
        winston_util_1.loggers.error(error);
        res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
});
exports.adminAuth = adminAuth;
const userAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        req.payload = { id: '', role: 'user' };
        next();
    }
    catch (error) {
        winston_util_1.loggers.error(error);
        res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
});
exports.userAuth = userAuth;
