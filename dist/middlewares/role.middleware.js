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
exports.verifyAdmin = void 0;
const types_1 = require("../types");
const winston_1 = require("../utils/winston");
const services_1 = require("../services");
const errors_1 = require("../errors");
const verifyAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const id = (_a = req.payload) === null || _a === void 0 ? void 0 : _a.id;
        if (!id)
            throw new Error("Can't get the role from jwt payload");
        const user = yield (0, services_1.findUserById)(id);
        if (!user)
            return next(new errors_1.NotFoundError());
        if (user.role == types_1.roles.admin)
            next();
        else
            next(new errors_1.ForbiddenError());
    }
    catch (error) {
        winston_1.loggers.error(error);
        next(new errors_1.InternalServerError());
    }
});
exports.verifyAdmin = verifyAdmin;
