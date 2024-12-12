import { studentBody } from "../types";



export const validateStudentBody=(reqBody:studentBody<string[]>)=>{
    if (typeof reqBody !== 'object' || reqBody === null) return false;

    const { name, age, email, subjects, grades } = reqBody;

    if ( typeof name !== 'string') return false;

    if (typeof age !== 'number' || age < 0) return false;

    if (typeof email !== 'string' || !/^\S+@\S+\.\S+$/.test(email)) return false;

    if (!Array.isArray(subjects) || !subjects.every(sub => typeof sub === 'string')) {
        return false;
    }

    if (subjects.length > 0 && grades) {
        const gradeKeys = Object.keys(grades);
        for (const key of gradeKeys) {
            if (!subjects.includes(key) || typeof grades[key] !== 'number') {
                return false;
            }
        }
    }

    return true;
}