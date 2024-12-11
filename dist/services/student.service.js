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
exports.deleteAllStudentsByUserId = exports.deleteStudentsById = exports.updateStudentsById = exports.insertStudents = exports.saveStudents = exports.findStudentsByUserId = exports.findStudentByMail = exports.findStudentById = exports.findStudents = void 0;
const winston_util_1 = require("../utils/winston.util");
const file_service_1 = require("./file.service");
const findStudents = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield (0, file_service_1.readData)();
        const { students } = data;
        return students;
    }
    catch (error) {
        winston_util_1.loggers.error(error);
        throw new Error("Can't find students due to an error");
    }
});
exports.findStudents = findStudents;
const findStudentById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const students = yield (0, exports.findStudents)();
        const student = students.find(item => item.id == id);
        return student ? student : null;
    }
    catch (error) {
        winston_util_1.loggers.error(error);
        throw new Error("Can't find Student with given id due to an error");
    }
});
exports.findStudentById = findStudentById;
const findStudentByMail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const students = yield (0, exports.findStudents)();
        const student = students.find(item => item.email == email);
        return student ? student : null;
    }
    catch (error) {
        winston_util_1.loggers.error(error);
        throw new Error("Can't find Student with given email due to an error");
    }
});
exports.findStudentByMail = findStudentByMail;
const findStudentsByUserId = () => {
};
exports.findStudentsByUserId = findStudentsByUserId;
const saveStudents = (newStudents) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield (0, file_service_1.readData)();
        data.students = newStudents;
        yield (0, file_service_1.writeData)(data);
        return true;
    }
    catch (error) {
        winston_util_1.loggers.error(error);
        throw new Error("Can't save students on Database due to an error");
    }
});
exports.saveStudents = saveStudents;
const insertStudents = (newStudent) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const students = yield (0, exports.findStudents)();
        students.push(newStudent);
        yield (0, exports.saveStudents)(students);
        return true;
    }
    catch (error) {
        winston_util_1.loggers.error(error);
        throw new Error("Can't insert user on Student due to an error");
    }
});
exports.insertStudents = insertStudents;
const updateStudentsById = () => {
};
exports.updateStudentsById = updateStudentsById;
const deleteStudentsById = () => {
};
exports.deleteStudentsById = deleteStudentsById;
const deleteAllStudentsByUserId = () => {
};
exports.deleteAllStudentsByUserId = deleteAllStudentsByUserId;
