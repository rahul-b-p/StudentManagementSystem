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
exports.generateId = void 0;
const winston_1 = require("../utils/winston");
const generateId = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const timestamp = Date.now().toString(16);
        const randomString = crypto.randomUUID();
        const uniqueId = (randomString + timestamp).slice(-23);
        return uniqueId;
    }
    catch (error) {
        winston_1.loggers.error(error);
        throw new Error("Can't generate Id due to an error");
    }
});
exports.generateId = generateId;
