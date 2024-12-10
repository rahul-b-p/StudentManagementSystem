import express from "express";
import { config } from 'dotenv';
import { loggers } from "./utils/winston.util";

config();

const app = express();
const port = process.env.PORT || 3000

app.use(express.json());


app.listen(port, () => {
    loggers.info(`Server Running at http://localhost:${port}`)
})

