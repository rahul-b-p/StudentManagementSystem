import express from "express";
import { config } from 'dotenv';
import { loggers } from "./utils/winston.util";
import { adminRouter, authRouter, refreshRoter, userRouter } from "./routers";
import { checkAdmin, JwtAuth, checkUser } from "./middlewares";
import cookieParser from "cookie-parser";

config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use(cookieParser());

app.use('/auth', authRouter);
app.use('/refresh', refreshRoter);

app.use(JwtAuth);
app.use('/admin', checkAdmin, adminRouter);
app.use('/user', checkUser, userRouter);


app.listen(port, () => {
    loggers.info(`Server Running at http://localhost:${port}`)
})

