import { Response } from "express"
import { customRequestWithPayload, Student, studentBody } from "../types"
import { loggers } from "../utils/winston.util";
import { findStudentByMail, findUserById, insertStudents } from "../services";
import { generateId } from "../config";



export const createStudent = async (req: customRequestWithPayload<{}, any, studentBody>, res: Response) => {
    try {
        const { name, age, email } = req.body;
        if (typeof name !== 'string' || typeof age !== 'number' || typeof email !== 'string') {
            res.status(400).json({ error: 'Invalid Request Body' });
        }

        const userId = req.payload?.id;
        if (!userId) throw new Error("Couldn't found the payload");

        const existinUser = await findUserById(userId);
        if (!existinUser) {
            res.status(404).json({ error: 'Requested with an Invalid UserId' });
            return;
        }

        if (existinUser.id !== userId) {
            res.status(409).json({ error: 'Requested by an Invalid User' });
            return;
        }

        const existingStudent = await findStudentByMail(email);
        if (existingStudent) {
            res.status(409).json({ error: 'One student already added with given mail id' });
            return;
        }

        const id = await generateId();
        const newStudent: Student<[]> = {
            id, userId, name, email, age
        }

        await insertStudents(newStudent);

        res.statusMessage = "Student Added"
        res.status(200).json({ message: 'New Student Added Succcessfully', data: { newStudent } })


    } catch (error: any) {
        loggers.error(error);
        res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
}

export const readAllStudents = () => {

}

export const readAllStudentsByUser = () => {

}

export const updateStudent = () => {

}

export const deleteStudent = () => {

}

export const deleteAllStudentsByUser = () => {

}

