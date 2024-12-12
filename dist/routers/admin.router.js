"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const controllers_1 = require("../controllers");
exports.router = (0, express_1.Router)();
// update admin
exports.router.put('/update', controllers_1.updateUser);
// read all users
exports.router.get('/read-users', controllers_1.readAllUsers);
// read all admins
exports.router.get('/read-admins', controllers_1.readAllAdmins);
