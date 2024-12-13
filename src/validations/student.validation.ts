import { studentBody } from "../types";
import { loggers } from "../utils/winston.util";



export const validateStudentBody = async (reqBody: studentBody<string[]>): Promise<boolean> => {
    try {
        if (typeof reqBody !== 'object' || reqBody === null) return false;

        const { name, age, email, subjects, marks } = reqBody;

        if (typeof name !== 'string') return false;

        if (typeof age !== 'number' || age < 0) return false;

        if (typeof email !== 'string' || !/^\S+@\S+\.\S+$/.test(email)) return false;

        if (!Array.isArray(subjects) || !subjects.every(sub => typeof sub === 'string')) {
            return false;
        }

        if (subjects.length > 0 && marks) {
            let keysCount = 0;
            const gradeKeys = Object.keys(marks);
            for (const key of gradeKeys) {
                if (!subjects.includes(key) || typeof marks[key] !== 'number') {
                    return false;
                }
                else keysCount++;
            }
            loggers.info(keysCount);
            if (keysCount !== subjects.length) return false;
        }

        return true;
    } catch (error) {
        loggers.error(error);
        throw new Error('Req Body Validation failed due to an error');
    }
}