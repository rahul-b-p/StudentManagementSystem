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
//read all students
exports.router.get('/read-students', controllers_1.readAllStudents);
