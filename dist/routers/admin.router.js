"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const controllers_1 = require("../controllers");
exports.router = (0, express_1.Router)();
// create admin
exports.router.post('/create-new', controllers_1.createAdmin);
// read all users
exports.router.get('/read-users', controllers_1.readAllUsers);
// read all admins
exports.router.get('/read-admins', controllers_1.readAllAdmins);
// update users by id
exports.router.put('/update-user/:id', controllers_1.updateUserByAdmin);
// delete user by id
exports.router.delete('/delete-user/:id', controllers_1.deleteUserByAdmin);
//read all students
exports.router.get('/read-students', controllers_1.readAllStudents);
// read students by grade
exports.router.get('/read-students/grade', controllers_1.readAllStudentsByGrade);
