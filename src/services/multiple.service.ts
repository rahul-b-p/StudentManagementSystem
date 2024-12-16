import { grades, StudentWithGrades } from "../types";
import { loggers } from "../utils/winston.util";
import { fetchGrades, findAverageGrade } from "./grades.service";
import { findStudents, findStudentsByUserId } from "./student.service"


export const fetchStudentsWithGrade = async (): Promise<StudentWithGrades[]> => {
    try {
        const students = await findStudents();

        const studentsWithGrades: StudentWithGrades[] = await Promise.all(
            students.map(async (item) => {
                let grades ={}
                let averageGrade:string="";
                if (item.marks) {
                    grades = await fetchGrades(item.marks);
                    averageGrade= await findAverageGrade(item.marks)
                }
                return {
                    id: item.id,
                    userId: item.userId,
                    name: item.name,
                    age: item.age,
                    email: item.email,
                    grades,
                    averageGrade
                } as StudentWithGrades;
            })
        );

        const Response = studentsWithGrades;

        return Response;
    } catch (error) {
        loggers.error(error)
        throw new Error('Fetching Grades of students failed due to an error');
    }
}

export const fetchStudentsWithGradeByUserId = async (id: string): Promise<StudentWithGrades[]> => {
    try {
        const students = await findStudentsByUserId(id);

        const studentsWithGrades: StudentWithGrades[] = await Promise.all(
            students.map(async (item) => {
                let grades = {}
                if (item.marks) {
                    grades = await fetchGrades(item.marks);
                }
                return {
                    id: item.id,
                    userId: item.userId,
                    name: item.name,
                    age: item.age,
                    email: item.email,
                    grades,
                } as StudentWithGrades;
            })
        );

        const Response = studentsWithGrades;

        return Response;
    } catch (error) {
        loggers.error(error)
        throw new Error('Fetching Grades of students failed due to an error');
    }
}



export const deleteUserAccount = () => {

}