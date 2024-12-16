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
exports.deleteUserAccount = exports.fetchStudentsWithGradeByUserId = exports.fetchStudentsWithGrade = void 0;
const winston_util_1 = require("../utils/winston.util");
const grades_service_1 = require("./grades.service");
const student_service_1 = require("./student.service");
const fetchStudentsWithGrade = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const students = yield (0, student_service_1.findStudents)();
        const studentsWithGrades = yield Promise.all(students.map((item) => __awaiter(void 0, void 0, void 0, function* () {
            let grades = {};
            if (item.marks) {
                grades = yield (0, grades_service_1.fetchGrades)(item.marks);
            }
            return {
                id: item.id,
                userId: item.userId,
                name: item.name,
                age: item.age,
                email: item.email,
                grades
            };
        })));
        const Response = studentsWithGrades;
        return Response;
    }
    catch (error) {
        winston_util_1.loggers.error(error);
        throw new Error('Fetching Grades of students failed due to an error');
    }
});
exports.fetchStudentsWithGrade = fetchStudentsWithGrade;
const fetchStudentsWithGradeByUserId = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const students = yield (0, student_service_1.findStudentsByUserId)(id);
        const studentsWithGrades = yield Promise.all(students.map((item) => __awaiter(void 0, void 0, void 0, function* () {
            let grades = {};
            if (item.marks) {
                grades = yield (0, grades_service_1.fetchGrades)(item.marks);
            }
            return {
                id: item.id,
                userId: item.userId,
                name: item.name,
                age: item.age,
                email: item.email,
                grades,
            };
        })));
        const Response = studentsWithGrades;
        return Response;
    }
    catch (error) {
        winston_util_1.loggers.error(error);
        throw new Error('Fetching Grades of students failed due to an error');
    }
});
exports.fetchStudentsWithGradeByUserId = fetchStudentsWithGradeByUserId;
const deleteUserAccount = () => {
};
exports.deleteUserAccount = deleteUserAccount;
