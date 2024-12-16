"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const controllers_1 = require("../controllers");
const middlewares_1 = require("../middlewares");
exports.router = (0, express_1.Router)();
// signup 
exports.router.post('/signup', controllers_1.signup);
// login 
exports.router.post('/login', controllers_1.login);
// logout not checked
exports.router.post('/logout', middlewares_1.JwtAuth, controllers_1.logout);
