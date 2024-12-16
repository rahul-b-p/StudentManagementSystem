import { JwtPayload } from "jsonwebtoken";
import { roles } from "./db.type";

export interface TokenPayload extends JwtPayload {
    id: string;
    role: roles;
    iat: number;
    exp: number;
}