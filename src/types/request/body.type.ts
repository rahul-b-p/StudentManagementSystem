export interface signupBody {
    username: string;
    email: string;
    password: string;
    role?: 'admin' | 'user';
}

export interface loginBody {
    email: string;
    password: string;
}

export interface updateUserBody{
    currentPassword:string;
    updatedPassword?:string;
    updatedUsername?:string;
    updatedEmail?:string;
}

export interface studentBody{
    name: string;
    age: number;
    email: string;
}


