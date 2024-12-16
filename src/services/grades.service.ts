import { grades, GradeSystem, StanderdGrades } from "../types";
import { loggers } from "../utils/winston.util"
import { readData, writeData } from "./file.service";




export const findGradeRange = async (): Promise<GradeSystem<StanderdGrades>> => {
    try {
        const data = await readData();
        if (data.gradeSystem) return data.gradeSystem;
        else {
            const StanderdGradeSystem: GradeSystem<StanderdGrades> = {
                ranges: {
                    "A+": [100, 90],
                    "A": [90, 80],
                    "B+": [80, 70],
                    "B": [70, 60],
                    "C+": [60, 50],
                    "C": [50, 40],
                    "D+": [40, 30],
                    "D": [30, 20],
                    'F': [20, 0]
                }
            }
            data.gradeSystem = StanderdGradeSystem;
            await writeData(data);
            return data.gradeSystem
        }
    } catch (error) {
        loggers.error(error);
        throw new Error("Can't find Standerd Grade System due to an error");
    }
}

export const updateGradeRange = async (gradeSystem: GradeSystem<StanderdGrades>): Promise<boolean> => {
    try {
        const data = await readData();
        data.gradeSystem = gradeSystem;
        await writeData(data);
        return true;
    } catch (error) {
        loggers.error(error);
        throw new Error("Can't find Standerd Grade System due to an error");
    }
}

export const resetGradeRange = async (): Promise<GradeSystem<StanderdGrades>> => {
    try {
        const data = await readData();

        const StanderdGradeSystem: GradeSystem<StanderdGrades> = {
            ranges: {
                "A+": [100, 90],
                "A": [90, 80],
                "B+": [80, 70],
                "B": [70, 60],
                "C+": [60, 50],
                "C": [50, 40],
                "D+": [40, 30],
                "D": [30, 20],
                'F': [20, 0]
            }
        }
        data.gradeSystem = StanderdGradeSystem;
        await writeData(data);
        return data.gradeSystem
    } catch (error) {
        loggers.error(error);
        throw new Error("Can't find Standerd Grade System due to an error");
    }
}

export const findGradesForMarks = async (mark: number): Promise<string> => {
    try {
        const { ranges } = await findGradeRange();
        if (!ranges) throw new Error("Can't found the grade range");

        if (mark == ranges["A+"][0]) return grades.Aplus;

        for (const [grade, range] of Object.entries(ranges)) {
            const [max, min] = range;
            if (mark < max && mark >= min) {
                return grade;
            }
        }

        throw new Error("System Failed to store valid grades");

    } catch (error) {
        loggers.error(error);
        throw new Error("Can't find Standerd Grade System due to an error");
    }
}

export const fetchGrades = async (marks: Record<string, number>): Promise<Record<string, string>> => {
    try {
        const grades: Record<string, string> = {}
        for (const [subject, mark] of Object.entries(marks)) {
            const grade = await findGradesForMarks(mark);
            grades[subject] = grade;
        }
        return grades;
    } catch (error) {
        loggers.error(error);
        throw new Error("Can't fetch grades on given object due to an error");
    }
}

export const findAverageGrade = async (marks:Record<string,number>):Promise<string>=>{
    try {
        const mark = Object.values(marks);
        const average = (mark.reduce((a,b)=>a+b))/mark.length;
        const averageGrade = findGradesForMarks(average);
        return averageGrade;
    } catch (error) {
        loggers.error(error);
        throw new Error("Can't find Average Grade by given marks due to an error");
    }
}

