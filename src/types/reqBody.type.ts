export interface signupReqBody {
    username: string;
    email: string;
    password: string;
    role:'admin'|'user';
}

export interface loginReqBody {
    email: string;
    password: string;
}