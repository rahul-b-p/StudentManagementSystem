
import { Response } from "express"
import { customRequestWithPayload, Student, studentBody } from "../types"
import { loggers } from "../utils/winston.util";
import { deleteStudentsById, fetchStudentsWithGrade, fetchStudentsWithGradeByUserId, findStudentById, findStudentByMail, findStudentsByAverageGrade, findUserById, insertStudents, updateStudentsById } from "../services";
import { generateId } from "../config";
import { validateStudentBody } from "../validations";
import { GradeQuery } from "../types/request/query.type";



export const createStudent = async (req: customRequestWithPayload<{}, any, studentBody<string[]>>, res: Response) => {
    try {

        const isValidReqBody = await validateStudentBody(req.body);

        if (!isValidReqBody) {
            res.status(400).json({ error: 'Invalid Request Body' });
            return;
        }

        const { name, age, email, subjects, marks } = req.body;

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
        const newStudent: Student<typeof subjects> = {
            id, userId, name, email, age, subjects, marks
        }

        await insertStudents(newStudent);

        res.statusMessage = "Student Added"
        res.status(200).json({ message: 'New Student Added Succcessfully', data: { newStudent } })


    } catch (error: any) {
        loggers.error(error);
        res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
}

export const readAllStudents = async (req: customRequestWithPayload, res: Response) => {
    try {
        const userId = req.payload?.id;
        if (!userId) throw new Error("Couldn't found the payload");

        const existinUser = await findUserById(userId);
        if (!existinUser) {
            res.status(404).json({ error: 'Requested with an Invalid UserId' });
            return;
        }

        const ResponseData = await fetchStudentsWithGrade();
        res.status(200).json({ message: 'Fetching all students from the aplication', ResponseData });
    } catch (error: any) {
        loggers.error(error);
        res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
}

export const readAllStudentsByUser = async (req: customRequestWithPayload, res: Response) => {
    try {
        const userId = req.payload?.id;
        if (!userId) throw new Error("Can't get the payload");

        const existinUser = await findUserById(userId);
        if (!existinUser) {
            res.status(404).json({ error: "Invalid User" });
        }

        const stuents = await fetchStudentsWithGradeByUserId(userId);
        res.status(200).json({ message: `Found all students added by ${existinUser?.username}`, ResponseData: stuents });
    } catch (error: any) {
        loggers.error(error);
        res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
}

export const readAllStudentsByGrade = async (req:customRequestWithPayload<{},any,any,GradeQuery>,res:Response)=>{
    try {
        const userId = req.payload?.id;
        if (!userId) throw new Error("Can't get the payload");

        const {grade} = req.query
        loggers.info(grade)
        if(!grade){
            res.status(400).json({ error: 'Missing query parameters:grade is required.' });
            return;
        }

        const existinUser = await findUserById(userId);
        if (!existinUser) {
            res.status(404).json({ error: "Invalid User" });
        }

        const stuents = await findStudentsByAverageGrade(grade);
        res.status(200).json({ message: `Found all students added by ${existinUser?.username}`, data: stuents });
    } catch (error: any) {
        loggers.error(error);
        res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
}

export const updateStudent = async (req: customRequestWithPayload<{ id: string }, any, studentBody<string[]>>, res: Response) => {
    try {
        const isValidReqBody = await validateStudentBody(req.body);
        if (!isValidReqBody) {
            res.status(400).json({ error: 'Invalid Request Body' });
            return;
        }

        const { name, age, email, subjects, marks } = req.body;

        const userId = req.payload?.id;
        if (!userId) throw new Error("Couldn't found the payload");

        const existinUser = await findUserById(userId);
        if (!existinUser) {
            res.status(404).json({ error: 'Requested with an Invalid UserId' });
            return;
        }

        const { id } = req.params;
        const existingStudent = await findStudentById(id);
        if (!existingStudent) {
            res.status(404).json({ error: 'No student found with given Id' });
            return;
        }

        const updatedStudent: Student<typeof subjects> = {
            id, userId, name, email, age, subjects, marks
        };

        await updateStudentsById(id, updatedStudent);
        res.statusMessage = "Updated Successfully";
        res.status(200).json({ message: "User Updated Successfully", ResponseData: updatedStudent });
    } catch (error: any) {
        loggers.error(error);
        res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
}

export const deleteStudent = async(req: customRequestWithPayload<{ id: string }, any, studentBody<string[]>>, res: Response) => {
    try {
        const userId = req.payload?.id;
        if (!userId) throw new Error("Couldn't found the payload");

        const id = req.params.id

        const existingUser = await findUserById(userId);
        if (!existingUser) {
            res.status(401).json({ messege: 'You are requested from an invalid user id' });
            return;
        }

        const student = await findStudentById(id);
        if (!student) {
            res.status(404).json({ messege: 'Not found any student with given id' });
            return;
        }

        if(existingUser.role!=='admin' && userId !== student.userId){
            res.status(403).json({error:'forbidden',message:"You don't have permision to delete this item"});
        }

        const result = await deleteStudentsById(id);
        loggers.info(result);
        if (!result) {
            res.status(404).json({ messege: 'Not found any student with given id' });
            return;
        }
        res.statusMessage = " Deleted Successfully";
        res.status(200).json({ messege: 'Deleted student with given Id ' });
    } catch (error: any) {
        loggers.error(error);
        res.status(500).json({ messege: 'Something went wrong', error });
    }
}

export const deleteAllStudentsByUser = () => {
    
}