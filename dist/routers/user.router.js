"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const controllers_1 = require("../controllers");
exports.router = (0, express_1.Router)();
// update user
exports.router.put('/update', controllers_1.updateUser);
// delete user
exports.router.delete('/delete', controllers_1.deleteUser);
// create student
exports.router.post('/create-student', controllers_1.createStudent);
// read all students added by user
exports.router.get('/read-students', controllers_1.readAllStudentsByUser);
// update a student
exports.router.put('/update-student/:id', controllers_1.updateStudent);
// delete student 
exports.router.delete('/delete-student/:id', controllers_1.deleteStudent);
// delete students by user
exports.router.delete('/delete-students', controllers_1.deleteAllStudentsByUser);
