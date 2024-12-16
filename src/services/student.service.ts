import { Student } from "../types";
import { loggers } from "../utils/winston.util";
import { readData, writeData } from "./file.service";



export const findStudents = async (): Promise<Student<string[]>[]> => {
    try {
        const data = await readData();
        const { students } = data;
        return students;
    } catch (error) {
        loggers.error(error);
        throw new Error("Can't find students due to an error");
    }
}

export const findStudentById = async (id: string): Promise<Student<string[]> | null> => {
    try {
        const students = await findStudents();
        const student = students.find(item => item.id == id);
        return student ? student : null;
    } catch (error) {
        loggers.error(error);
        throw new Error("Can't find Student with given id due to an error");
    }
}

export const findStudentByMail = async (email: string): Promise<Student<string[]> | null> => {
    try {
        const students = await findStudents();
        const student = students.find(item => item.email == email);
        return student ? student : null;
    } catch (error) {
        loggers.error(error);
        throw new Error("Can't find Student with given email due to an error");
    }
}

export const findStudentsByUserId = async (userId: string): Promise<Student<string[]>[] | []> => {
    try {
        const students = await findStudents()
        return students.filter(item => item.userId == userId);
    } catch (error) {
        loggers.error(error);
        throw new Error("Can't find students added by the users due to an error");
    }
}

export const saveStudents = async (newStudents: Student<string[]>[]): Promise<boolean> => {
    try {
        const data = await readData();
        data.students = newStudents;
        await writeData(data);
        return true;
    } catch (error) {
        loggers.error(error);
        throw new Error("Can't save students on Database due to an error");
    }
}

export const insertStudents = async (newStudent: Student<string[]>): Promise<boolean> => {
    try {
        const students: Student<string[] | []>[] = await findStudents();
        students.push(newStudent);
        await saveStudents(students);
        return true;
    } catch (error) {
        loggers.error(error);
        throw new Error("Can't insert user on Student due to an error");
    }
}

export const updateStudentsById = async (id: string, updatedStudent: Student<string[]>) => {
    try {
        const students = await findStudents();
        const updateIndex = students.findIndex(item => item.id == id);
        if (updateIndex == -1) return false;
        else {
            students[updateIndex] = updatedStudent;
            await saveStudents(students);
            return true;
        }
    } catch (error) {
        loggers.error(error);
        throw new Error("Can't update student with given id due to an error");
    }
}

export const deleteStudentsById = async(id:string):Promise<boolean> => {
    try {
        const students = await findStudents();
        const deleteIndex = students.findIndex(item => item.id == id);
        if (deleteIndex == -1) return false;
        else{
            students.splice(deleteIndex,1);
            await saveStudents(students);
            return true;
        }
    } catch (error) {
        loggers.error(error);
        throw new Error("Can't delete student with given id due to an error");
    }
}

export const deleteAllStudentsByUserId = () => {

}


