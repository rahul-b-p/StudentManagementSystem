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
exports.findStudentsByAverageGrade = exports.fetchStudentsWithGradeByUserId = exports.fetchStudentsWithGrade = exports.findAverageGrade = exports.fetchGrades = exports.findGradesForMarks = exports.resetGradeRange = exports.updateGradeRange = exports.findGradeRange = void 0;
const winston_util_1 = require("../utils/winston.util");
const file_service_1 = require("./file.service");
const student_service_1 = require("./student.service");
const findGradeRange = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield (0, file_service_1.readData)();
        if (data.gradeSystem)
            return data.gradeSystem;
        else {
            const StanderdGradeSystem = {
                ranges: {
                    "A+": [100, 90],
                    "A": [90, 80],
                    "B+": [80, 70],
                    "B": [70, 60],
                    "C+": [60, 50],
                    "C": [50, 40],
                    "D+": [40, 30],
                    "D": [30, 20],
                    'F': [20, 0]
                }
            };
            data.gradeSystem = StanderdGradeSystem;
            yield (0, file_service_1.writeData)(data);
            return data.gradeSystem;
        }
    }
    catch (error) {
        winston_util_1.loggers.error(error);
        throw new Error("Can't find Standerd Grade System due to an error");
    }
});
exports.findGradeRange = findGradeRange;
const updateGradeRange = (gradeSystem) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield (0, file_service_1.readData)();
        data.gradeSystem = gradeSystem;
        yield (0, file_service_1.writeData)(data);
        return true;
    }
    catch (error) {
        winston_util_1.loggers.error(error);
        throw new Error("Can't find Standerd Grade System due to an error");
    }
});
exports.updateGradeRange = updateGradeRange;
const resetGradeRange = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield (0, file_service_1.readData)();
        const StanderdGradeSystem = {
            ranges: {
                "A+": [100, 90],
                "A": [90, 80],
                "B+": [80, 70],
                "B": [70, 60],
                "C+": [60, 50],
                "C": [50, 40],
                "D+": [40, 30],
                "D": [30, 20],
                'F': [20, 0]
            }
        };
        data.gradeSystem = StanderdGradeSystem;
        yield (0, file_service_1.writeData)(data);
        return data.gradeSystem;
    }
    catch (error) {
        winston_util_1.loggers.error(error);
        throw new Error("Can't find Standerd Grade System due to an error");
    }
});
exports.resetGradeRange = resetGradeRange;
const findGradesForMarks = (mark) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { ranges } = yield (0, exports.findGradeRange)();
        if (!ranges)
            throw new Error("Can't found the grade range");
        if (mark == ranges["A+"][0])
            return "A+" /* grades.Aplus */;
        for (const [grade, range] of Object.entries(ranges)) {
            const [max, min] = range;
            if (mark < max && mark >= min) {
                return grade;
            }
        }
        throw new Error("System Failed to store valid grades");
    }
    catch (error) {
        winston_util_1.loggers.error(error);
        throw new Error("Can't find Standerd Grade System due to an error");
    }
});
exports.findGradesForMarks = findGradesForMarks;
const fetchGrades = (marks) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const grades = {};
        for (const [subject, mark] of Object.entries(marks)) {
            const grade = yield (0, exports.findGradesForMarks)(mark);
            grades[subject] = grade;
        }
        return grades;
    }
    catch (error) {
        winston_util_1.loggers.error(error);
        throw new Error("Can't fetch grades on given object due to an error");
    }
});
exports.fetchGrades = fetchGrades;
const findAverageGrade = (marks) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const mark = Object.values(marks);
        const average = (mark.reduce((a, b) => a + b)) / mark.length;
        const averageGrade = (0, exports.findGradesForMarks)(average);
        return averageGrade;
    }
    catch (error) {
        winston_util_1.loggers.error(error);
        throw new Error("Can't find Average Grade by given marks due to an error");
    }
});
exports.findAverageGrade = findAverageGrade;
const fetchStudentsWithGrade = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const students = yield (0, student_service_1.findStudents)();
        const studentsWithGrades = yield Promise.all(students.map((item) => __awaiter(void 0, void 0, void 0, function* () {
            let grades = {};
            let averageGrade = "";
            if (item.marks) {
                grades = yield (0, exports.fetchGrades)(item.marks);
                averageGrade = yield (0, exports.findAverageGrade)(item.marks);
            }
            return {
                id: item.id,
                userId: item.userId,
                name: item.name,
                age: item.age,
                email: item.email,
                grades,
                averageGrade
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
                grades = yield (0, exports.fetchGrades)(item.marks);
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
const findStudentsByAverageGrade = (grade) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const students = yield (0, exports.fetchStudentsWithGrade)();
        return students.filter(item => item.averageGrade == grade);
    }
    catch (error) {
        winston_util_1.loggers.error(error);
        throw new Error('Something went wrong by fetching students with given id');
    }
});
exports.findStudentsByAverageGrade = findStudentsByAverageGrade;
