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
exports.deleteAllStudentsByUser = exports.deleteStudent = exports.updateStudent = exports.readAllStudentsByUser = exports.readAllStudents = exports.createStudent = void 0;
const winston_util_1 = require("../utils/winston.util");
const services_1 = require("../services");
const config_1 = require("../config");
const validations_1 = require("../validations");
const createStudent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const isValidReqBody = yield (0, validations_1.validateStudentBody)(req.body);
        if (!isValidReqBody) {
            res.status(400).json({ error: 'Invalid Request Body' });
            return;
        }
        const { name, age, email, subjects, grades } = req.body;
        const userId = (_a = req.payload) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId)
            throw new Error("Couldn't found the payload");
        const existinUser = yield (0, services_1.findUserById)(userId);
        if (!existinUser) {
            res.status(404).json({ error: 'Requested with an Invalid UserId' });
            return;
        }
        if (existinUser.id !== userId) {
            res.status(409).json({ error: 'Requested by an Invalid User' });
            return;
        }
        const existingStudent = yield (0, services_1.findStudentByMail)(email);
        if (existingStudent) {
            res.status(409).json({ error: 'One student already added with given mail id' });
            return;
        }
        const id = yield (0, config_1.generateId)();
        const newStudent = {
            id, userId, name, email, age, subjects, grades
        };
        yield (0, services_1.insertStudents)(newStudent);
        res.statusMessage = "Student Added";
        res.status(200).json({ message: 'New Student Added Succcessfully', data: { newStudent } });
    }
    catch (error) {
        winston_util_1.loggers.error(error);
        res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
});
exports.createStudent = createStudent;
const readAllStudents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.payload) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId)
            throw new Error("Couldn't found the payload");
        const existinUser = yield (0, services_1.findUserById)(userId);
        if (!existinUser) {
            res.status(404).json({ error: 'Requested with an Invalid UserId' });
            return;
        }
        const students = yield (0, services_1.findStudents)();
        res.status(200).json({ message: 'Fetching all students from the aplication', responseData: students });
    }
    catch (error) {
    }
});
exports.readAllStudents = readAllStudents;
const readAllStudentsByUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.payload) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId)
            throw new Error("Can't get the payload");
        const existinUser = yield (0, services_1.findUserById)(userId);
        if (!existinUser) {
            res.status(404).json({ error: "Invalid User" });
        }
        const stuents = yield (0, services_1.findStudentsByUserId)(userId);
        res.status(200).json({ message: `Found all students added by ${existinUser === null || existinUser === void 0 ? void 0 : existinUser.username}`, ResponseData: stuents });
    }
    catch (error) {
        winston_util_1.loggers.error(error);
        res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
});
exports.readAllStudentsByUser = readAllStudentsByUser;
const updateStudent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const isValidReqBody = yield (0, validations_1.validateStudentBody)(req.body);
        if (!isValidReqBody) {
            res.status(400).json({ error: 'Invalid Request Body' });
            return;
        }
        const { name, age, email, subjects, grades } = req.body;
        const userId = (_a = req.payload) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId)
            throw new Error("Couldn't found the payload");
        const existinUser = yield (0, services_1.findUserById)(userId);
        if (!existinUser) {
            res.status(404).json({ error: 'Requested with an Invalid UserId' });
            return;
        }
        const { id } = req.params;
        const existingStudent = yield (0, services_1.findStudentById)(id);
        if (!existingStudent) {
            res.status(404).json({ error: 'No student found with given Id' });
            return;
        }
        const updatedStudent = {
            id, userId, name, email, age, subjects, grades
        };
        yield (0, services_1.updateStudentsById)(id, updatedStudent);
        res.statusMessage = "Updated Successfully";
        res.status(200).json({ message: "User Updated Successfully", ResponseData: updatedStudent });
    }
    catch (error) {
        winston_util_1.loggers.error(error);
        res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
});
exports.updateStudent = updateStudent;
const deleteStudent = () => {
};
exports.deleteStudent = deleteStudent;
const deleteAllStudentsByUser = () => {
};
exports.deleteAllStudentsByUser = deleteAllStudentsByUser;
