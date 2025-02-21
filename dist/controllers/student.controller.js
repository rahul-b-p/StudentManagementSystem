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
exports.deleteAllStudentsByUser = exports.deleteStudent = exports.updateStudent = exports.readAllStudentsByGrade = exports.readAllStudentsByUser = exports.readAllStudents = exports.createStudent = void 0;
const winston_1 = require("../utils/winston");
const services_1 = require("../services");
const config_1 = require("../config");
const validations_1 = require("../validations");
const errors_1 = require("../errors");
const successResponse_1 = require("../utils/successResponse");
const createStudent = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const isValidReqBody = yield (0, validations_1.validateStudentBody)(req.body);
        if (!isValidReqBody)
            return next(new errors_1.BadRequestError());
        const { name, age, email, subjects, marks } = req.body;
        const userId = (_a = req.payload) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId)
            throw new Error("Couldn't found the payload");
        const existinUser = yield (0, services_1.findUserById)(userId);
        if (!existinUser)
            return next(new errors_1.NotFoundError());
        const existingStudent = yield (0, services_1.findStudentByMail)(email);
        if (existingStudent)
            return next(new errors_1.ConflictError());
        const id = yield (0, config_1.generateId)();
        const newStudent = {
            id, userId, name, email, age, subjects, marks
        };
        yield (0, services_1.insertStudents)(newStudent);
        res.statusMessage = "Created Successful";
        res.status(200).json(yield (0, successResponse_1.sendSuccessResponse)('Created new student', newStudent));
    }
    catch (error) {
        winston_1.loggers.error(error);
        next(new errors_1.InternalServerError());
    }
});
exports.createStudent = createStudent;
const readAllStudents = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.payload) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId)
            throw new Error("Couldn't found the payload");
        const existinUser = yield (0, services_1.findUserById)(userId);
        if (!existinUser)
            return next(new errors_1.NotFoundError());
        const ResponseData = yield (0, services_1.fetchStudentsWithGrade)();
        res.status(200).json(yield (0, successResponse_1.sendSuccessResponse)('Sucessfully Fetched all Students details', ResponseData));
    }
    catch (error) {
        winston_1.loggers.error(error);
        next(new errors_1.InternalServerError());
    }
});
exports.readAllStudents = readAllStudents;
const readAllStudentsByUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.payload) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId)
            throw new Error("Can't get the payload");
        const existinUser = yield (0, services_1.findUserById)(userId);
        if (!existinUser)
            return next(new errors_1.NotFoundError());
        const responseData = yield (0, services_1.fetchStudentsWithGradeByUserId)(userId);
        res.status(200).json(yield (0, successResponse_1.sendSuccessResponse)(`Fetched all students added by ${existinUser === null || existinUser === void 0 ? void 0 : existinUser.username}`, responseData));
    }
    catch (error) {
        winston_1.loggers.error(error);
        next(new errors_1.InternalServerError());
    }
});
exports.readAllStudentsByUser = readAllStudentsByUser;
const readAllStudentsByGrade = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.payload) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId)
            throw new Error("Can't get the payload");
        const { grade } = req.query;
        winston_1.loggers.info(grade);
        if (!grade)
            return next(new errors_1.BadRequestError());
        const existinUser = yield (0, services_1.findUserById)(userId);
        if (!existinUser)
            return next(new errors_1.NotFoundError());
        const responseData = yield (0, services_1.findStudentsByAverageGrade)(grade);
        res.status(200).json(yield (0, successResponse_1.sendSuccessResponse)('Fetched all students with given average grade', responseData));
    }
    catch (error) {
        winston_1.loggers.error(error);
        next(new errors_1.InternalServerError());
    }
});
exports.readAllStudentsByGrade = readAllStudentsByGrade;
const updateStudent = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const isValidReqBody = yield (0, validations_1.validateStudentBody)(req.body);
        if (!isValidReqBody)
            return next(new errors_1.BadRequestError());
        const { name, age, email, subjects, marks } = req.body;
        const userId = (_a = req.payload) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId)
            throw new Error("Couldn't found the payload");
        const existinUser = yield (0, services_1.findUserById)(userId);
        if (!existinUser)
            return next(new errors_1.NotFoundError());
        const { id } = req.params;
        const existingStudent = yield (0, services_1.findStudentById)(id);
        if (!existingStudent)
            return next(new errors_1.RersourceNotFoundError());
        const updatedStudent = {
            id, userId, name, email, age, subjects, marks
        };
        yield (0, services_1.updateStudentsById)(id, updatedStudent);
        res.statusMessage = "Updated Successfully";
        res.status(200).json(yield (0, successResponse_1.sendSuccessResponse)('Student Updated Successfully', updatedStudent));
    }
    catch (error) {
        winston_1.loggers.error(error);
        next(new errors_1.InternalServerError());
    }
});
exports.updateStudent = updateStudent;
const deleteStudent = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.payload) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId)
            throw new Error("Couldn't found the payload");
        const id = req.params.id;
        const existingUser = yield (0, services_1.findUserById)(userId);
        if (!existingUser)
            return next(new errors_1.NotFoundError());
        const student = yield (0, services_1.findStudentById)(id);
        if (!student)
            return next(new errors_1.RersourceNotFoundError());
        if (existingUser.role !== 'admin' && userId !== student.userId)
            return next(new errors_1.ForbiddenError());
        const result = yield (0, services_1.deleteStudentsById)(id);
        winston_1.loggers.info(result);
        if (!result)
            return next(new errors_1.RersourceNotFoundError());
        res.statusMessage = " Deleted Successfully";
        res.status(200).json(yield (0, successResponse_1.sendSuccessResponse)('Deleted Student with given Id'));
    }
    catch (error) {
        winston_1.loggers.error(error);
        next(new errors_1.InternalServerError());
    }
});
exports.deleteStudent = deleteStudent;
const deleteAllStudentsByUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.payload) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId)
            throw new Error("Couldn't found the payload");
        const existingUser = yield (0, services_1.findUserById)(userId);
        if (!existingUser)
            return next(new errors_1.NotFoundError());
        yield (0, services_1.deleteAllStudentsByUserId)(userId);
        res.statusMessage = " Deleted Successfully";
        res.status(200).json(yield (0, successResponse_1.sendSuccessResponse)('Deleted all students created by the user'));
    }
    catch (error) {
        winston_1.loggers.error(error);
        next(new errors_1.InternalServerError());
    }
});
exports.deleteAllStudentsByUser = deleteAllStudentsByUser;
