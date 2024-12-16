import express from "express";
import { config } from 'dotenv';
import { loggers } from "./utils/winston";
import { adminRouter, authRouter, refreshRoter, userRouter } from "./routers";
import { verifyAdmin, JwtAuth, ErrorHandler } from "./middlewares";
import cookieParser from "cookie-parser";

config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use(cookieParser());

app.use('/auth', authRouter);
app.use('/refresh', refreshRoter);

app.use('/admin', JwtAuth, verifyAdmin, adminRouter);
app.use('/user', JwtAuth, userRouter);


app.use(ErrorHandler);


app.listen(port, () => {
    loggers.info(`Server Running at http://localhost:${port}`)
})

