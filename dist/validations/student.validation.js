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
exports.validateStudentBody = void 0;
const winston_util_1 = require("../utils/winston.util");
const validateStudentBody = (reqBody) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (typeof reqBody !== 'object' || reqBody === null)
            return false;
        const { name, age, email, subjects, grades } = reqBody;
        if (typeof name !== 'string')
            return false;
        if (typeof age !== 'number' || age < 0)
            return false;
        if (typeof email !== 'string' || !/^\S+@\S+\.\S+$/.test(email))
            return false;
        if (!Array.isArray(subjects) || !subjects.every(sub => typeof sub === 'string')) {
            return false;
        }
        if (subjects.length > 0 && grades) {
            let keysCount = 0;
            const gradeKeys = Object.keys(grades);
            for (const key of gradeKeys) {
                if (!subjects.includes(key) || typeof grades[key] !== 'number') {
                    return false;
                }
                else
                    keysCount++;
            }
            winston_util_1.loggers.info(keysCount);
            if (keysCount !== subjects.length)
                return false;
        }
        return true;
    }
    catch (error) {
        winston_util_1.loggers.error(error);
        throw new Error('Req Body Validation failed due to an error');
    }
});
exports.validateStudentBody = validateStudentBody;
