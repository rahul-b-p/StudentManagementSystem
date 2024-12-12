"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateStudentBody = void 0;
const validateStudentBody = (reqBody) => {
    if (typeof reqBody !== 'object' || reqBody === null)
        return false;
    const { name, age, email, subjects, grades } = reqBody;
    // Validate required fields
    if (typeof name !== 'string')
        return false;
    if (typeof age !== 'number' || age < 0)
        return false;
    if (typeof email !== 'string' || !/^\S+@\S+\.\S+$/.test(email))
        return false;
    // Validate subjects array
    if (!Array.isArray(subjects) || !subjects.every(sub => typeof sub === 'string')) {
        return false;
    }
    // Validate grades if subjects are not empty
    if (subjects.length > 0 && grades) {
        const gradeKeys = Object.keys(grades);
        for (const key of gradeKeys) {
            if (!subjects.includes(key) || typeof grades[key] !== 'number') {
                return false;
            }
        }
    }
    return true;
};
exports.validateStudentBody = validateStudentBody;
