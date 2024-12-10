export interface Student<TSubjects extends readonly string[] = []> {
    id: string;
    userId: string;
    name: string;
    age: number;
    email: string;
    subjects?: TSubjects;
    grades?: TSubjects extends [] ? never : { [key in TSubjects[number]]?: number };
};

export interface User {
    id: string;
    username: string;
    email: string;
    password: string;
    role: 'admin' | 'user';
};

export interface JSONDataBase {
    users: User[] | [];
    students: Student[] | [];
};



