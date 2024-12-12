"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const controllers_1 = require("../controllers");
const middlewares_1 = require("../middlewares");
exports.router = (0, express_1.Router)();
// signup by admin
exports.router.post('/signup-admin', middlewares_1.adminAuth, controllers_1.signup);
// signup by user
exports.router.post('/signup-user', middlewares_1.userAuth, controllers_1.signup);
// login by admin
exports.router.post('/login-admin', middlewares_1.adminAuth, controllers_1.login);
// login by user
exports.router.post('/login-user', middlewares_1.userAuth, controllers_1.login);
// logout not checked
exports.router.post('/logout', middlewares_1.JwtAuth, controllers_1.logout);
