import express from "express";
import { config } from 'dotenv';
import { loggers } from "./utils/winston.util";
import { adminRouter, authRouter, refreshRoter, userRouter } from "./routers";
import { JwtAuthMiddleware } from "./middlewares";
import cookieParser from "cookie-parser";

config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use(cookieParser());

app.use('/auth', authRouter);
app.use('/refresh',refreshRoter);

app.use(JwtAuthMiddleware);
app.use('/admin', adminRouter);
app.use('/user', userRouter);


app.listen(port, () => {
    loggers.info(`Server Running at http://localhost:${port}`)
})

