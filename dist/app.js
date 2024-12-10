"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = require("dotenv");
const winston_util_1 = require("./utils/winston.util");
const routers_1 = require("./routers");
(0, dotenv_1.config)();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use(express_1.default.json());
app.use('/auth', routers_1.authRouter);
app.use('/admin', routers_1.adminRouter);
app.use('/user', routers_1.userRouter);
app.listen(port, () => {
    winston_util_1.loggers.info(`Server Running at http://localhost:${port}`);
});
