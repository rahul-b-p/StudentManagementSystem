export interface userReqBody {
    username: string;
    email: string;
    password: string;
    role:'admin'|'user';
}