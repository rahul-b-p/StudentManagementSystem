"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = require("dotenv");
const winston_util_1 = require("./utils/winston.util");
const routers_1 = require("./routers");
const middlewares_1 = require("./middlewares");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
(0, dotenv_1.config)();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use('/auth', routers_1.authRouter);
app.use('/refresh', routers_1.refreshRoter);
app.use(middlewares_1.JwtAuth);
app.use('/admin', middlewares_1.checkAdmin, routers_1.adminRouter);
app.use('/user', middlewares_1.checkUser, routers_1.userRouter);
app.listen(port, () => {
    winston_util_1.loggers.info(`Server Running at http://localhost:${port}`);
});
