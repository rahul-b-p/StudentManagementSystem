export interface signupBody {
    username: string;
    email: string;
    password: string;
    role:'admin'|'user';
}

export interface loginBody {
    email: string;
    password: string;
}