
import { NextFunction, Response } from "express"
import { customRequestWithPayload, Student, studentBody } from "../types"
import { loggers } from "../utils/winston";
import { deleteAllStudentsByUserId, deleteStudentsById, fetchStudentsWithGrade, fetchStudentsWithGradeByUserId, findStudentById, findStudentByMail, findStudentsByAverageGrade, findUserById, insertStudents, updateStudentsById } from "../services";
import { generateId } from "../config";
import { validateStudentBody } from "../validations";
import { GradeQuery } from "../types/request/query.type";
import { InternalServerError, NotFoundError, BadRequestError, ForbiddenError, RersourceNotFoundError, ConflictError } from "../errors";






export const createStudent = async (req: customRequestWithPayload<{}, any, studentBody<string[]>>, res: Response, next: NextFunction) => {
    try {

        const isValidReqBody = await validateStudentBody(req.body);

        if (!isValidReqBody) return next(new BadRequestError());

        const { name, age, email, subjects, marks } = req.body;

        const userId = req.payload?.id;
        if (!userId) throw new Error("Couldn't found the payload");

        const existinUser = await findUserById(userId);
        if (!existinUser) return next(new NotFoundError());

        const existingStudent = await findStudentByMail(email);
        if (existingStudent) return next(new ConflictError());

        const id = await generateId();
        const newStudent: Student<typeof subjects> = {
            id, userId, name, email, age, subjects, marks
        }

        await insertStudents(newStudent);

        res.statusMessage = "Student Added"
        res.status(200).json({ message: 'New Student Added Succcessfully', data: { newStudent } })


    } catch (error) {
        loggers.error(error);
        next(new InternalServerError());
    }
}

export const readAllStudents = async (req: customRequestWithPayload, res: Response, next: NextFunction) => {
    try {
        const userId = req.payload?.id;
        if (!userId) throw new Error("Couldn't found the payload");

        const existinUser = await findUserById(userId);
        if (!existinUser) return next(new NotFoundError());

        const ResponseData = await fetchStudentsWithGrade();
        res.status(200).json({ message: 'Fetching all students from the aplication', ResponseData });
    } catch (error) {
        loggers.error(error);
        next(new InternalServerError());
    }
}

export const readAllStudentsByUser = async (req: customRequestWithPayload, res: Response, next: NextFunction) => {
    try {
        const userId = req.payload?.id;
        if (!userId) throw new Error("Can't get the payload");

        const existinUser = await findUserById(userId);
        if (!existinUser) return next(new NotFoundError());

        const stuents = await fetchStudentsWithGradeByUserId(userId);
        res.status(200).json({ message: `Found all students added by ${existinUser?.username}`, ResponseData: stuents });
    } catch (error) {
        loggers.error(error);
        next(new InternalServerError());
    }
}

export const readAllStudentsByGrade = async (req: customRequestWithPayload<{}, any, any, GradeQuery>, res: Response, next: NextFunction) => {
    try {
        const userId = req.payload?.id;
        if (!userId) throw new Error("Can't get the payload");

        const { grade } = req.query
        loggers.info(grade)
        if (!grade) return next(new BadRequestError());

        const existinUser = await findUserById(userId);
        if (!existinUser) return next(new NotFoundError());

        const stuents = await findStudentsByAverageGrade(grade);
        res.status(200).json({ message: `Found all students added by ${existinUser?.username}`, data: stuents });
    } catch (error) {
        loggers.error(error);
        next(new InternalServerError());
    }
}

export const updateStudent = async (req: customRequestWithPayload<{ id: string }, any, studentBody<string[]>>, res: Response, next: NextFunction) => {
    try {
        const isValidReqBody = await validateStudentBody(req.body);
        if (!isValidReqBody) return next(new BadRequestError());

        const { name, age, email, subjects, marks } = req.body;

        const userId = req.payload?.id;
        if (!userId) throw new Error("Couldn't found the payload");

        const existinUser = await findUserById(userId);
        if (!existinUser) return next(new NotFoundError());

        const { id } = req.params;
        const existingStudent = await findStudentById(id);
        if (!existingStudent) return next(new RersourceNotFoundError());

        const updatedStudent: Student<typeof subjects> = {
            id, userId, name, email, age, subjects, marks
        };

        await updateStudentsById(id, updatedStudent);
        res.statusMessage = "Updated Successfully";
        res.status(200).json({ message: "User Updated Successfully", ResponseData: updatedStudent });
    } catch (error) {
        loggers.error(error);
        next(new InternalServerError());
    }
}

export const deleteStudent = async (req: customRequestWithPayload<{ id: string }>, res: Response, next: NextFunction) => {
    try {
        const userId = req.payload?.id;
        if (!userId) throw new Error("Couldn't found the payload");

        const id = req.params.id

        const existingUser = await findUserById(userId);
        if (!existingUser) return next(new NotFoundError());

        const student = await findStudentById(id);
        if (!student) return next(new RersourceNotFoundError());

        if (existingUser.role !== 'admin' && userId !== student.userId) return next(new ForbiddenError());

        const result = await deleteStudentsById(id);
        loggers.info(result);
        if (!result) return next(new RersourceNotFoundError());
        res.statusMessage = " Deleted Successfully";
        res.status(200).json({ messege: 'Deleted student with given Id ' });
    } catch (error) {
        loggers.error(error);
        next(new InternalServerError());
    }
}

export const deleteAllStudentsByUser = async (req: customRequestWithPayload, res: Response, next: NextFunction) => {
    try {
        const userId = req.payload?.id;
        if (!userId) throw new Error("Couldn't found the payload");

        const existingUser = await findUserById(userId);
        if (!existingUser) return next(new NotFoundError());

        await deleteAllStudentsByUserId(userId);
        res.statusMessage = " Deleted Successfully";
        res.status(200).json({ messege: 'Deleted all students created by the user' });

    } catch (error) {
        loggers.error(error);
        next(new InternalServerError());
    }
}