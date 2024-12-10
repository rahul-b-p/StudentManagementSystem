import express from "express";
import { config } from 'dotenv';
import { loggers } from "./utils/winston.util";
import { adminRouter, authRouter, userRouter } from "./routers";

config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use('/auth', authRouter);
app.use('/admin', adminRouter);
app.use('/user', userRouter);


app.listen(port, () => {
    loggers.info(`Server Running at http://localhost:${port}`)
})

