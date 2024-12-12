import { Student } from "../db.type";

export interface authBody {
    username: string;
    email: string;
    password: string;
}

export interface updateUserBody {
    currentPassword: string;
    updatedPassword?: string;
    updatedUsername?: string;
    updatedEmail?: string;
}

export interface studentBody<TSubjects extends readonly string[] = []> {
    name: string;
    age: number;
    email: string;
    subjects: TSubjects;
    grades: TSubjects extends [] ? never : { [key in TSubjects[number]]?: number };
};


