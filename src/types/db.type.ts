import { StanderdGrades } from "./grade.type";

export interface Student<TSubjects extends readonly string[] = []> {
    id: string;
    userId: string;
    name: string;
    age: number;
    email: string;
    subjects: TSubjects;
    marks: TSubjects extends [] ? never : { [key in TSubjects[number]]: number };
};

export enum roles { admin = 'admin', user = 'user' };

export interface User {
    id: string;
    username: string;
    email: string;
    hashPassword: string;
    role: roles;
    refreshToken?: string;
};

export interface GradeSystem<Tgrades extends readonly string[] = []> {
    ranges?: Tgrades extends [] ? never : { [key in Tgrades[number]]: [number, number] };
};

export interface JSONDataBase {
    users: User[] | [];
    students: Student<string[]>[] | [];
    gradeSystem?: GradeSystem<StanderdGrades>;
};







