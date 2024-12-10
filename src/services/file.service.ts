import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import { loggers } from '../utils/winston.util';
import { JSONDataBase } from '../types';
import { DefaultDeserializer } from 'v8';


const DB_FILE_PATH = path.join(path.dirname(path.dirname(__dirname)), 'db.json');

export const readData = async (): Promise<JSONDataBase> => {
    try {
        const fileContent = await readFile(DB_FILE_PATH, 'utf-8');
        const data: JSONDataBase = JSON.parse(fileContent);
        loggers.info('Data Readed Successfully');
        return data;
    } catch (error) {
        loggers.info('Empty DataBase Found...!');
        return initializeDB();
    }
}

export const initializeDB = async (): Promise<JSONDataBase> => {
    try {
        const data: JSONDataBase = {
            users: [],
            students: []
        }
        await writeFile(DB_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
        loggers.info('DataBase Initialized Successfully');
        return data;
    } catch (error) {
        loggers.error(error);
        throw new Error('Error happens while Initializing new DB');
    }
}

export const writeData = async (data: JSONDataBase):Promise<boolean> => {
    try {
        await writeFile(DB_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
        loggers.info('Data Written Successfully');
        return true;
    } catch (error) {
        loggers.error(error);
        throw new Error("Error happens while writing data into file");
    }
};

