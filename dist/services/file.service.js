"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeData = exports.initializeDB = exports.readData = void 0;
const promises_1 = require("fs/promises");
const path_1 = __importDefault(require("path"));
const winston_1 = require("../utils/winston");
const DB_FILE_PATH = path_1.default.join(path_1.default.dirname(path_1.default.dirname(__dirname)), 'db.json');
const readData = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fileContent = yield (0, promises_1.readFile)(DB_FILE_PATH, 'utf-8');
        const data = JSON.parse(fileContent);
        winston_1.loggers.info('Data Readed Successfully');
        return data;
    }
    catch (error) {
        winston_1.loggers.info('Empty DataBase Found...!');
        return (0, exports.initializeDB)();
    }
});
exports.readData = readData;
const initializeDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = {
            users: [],
            students: []
        };
        yield (0, promises_1.writeFile)(DB_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
        winston_1.loggers.info('DataBase Initialized Successfully');
        return data;
    }
    catch (error) {
        winston_1.loggers.error(error);
        throw new Error('Error happens while Initializing new DB');
    }
});
exports.initializeDB = initializeDB;
const writeData = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, promises_1.writeFile)(DB_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
        winston_1.loggers.info('Data Written Successfully');
        return true;
    }
    catch (error) {
        winston_1.loggers.error(error);
        throw new Error("Error happens while writing data into file");
    }
});
exports.writeData = writeData;
