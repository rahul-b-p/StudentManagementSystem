import { JwtPayload } from "jsonwebtoken";

export interface TokenPayload extends JwtPayload {
    id: string,
    role: 'admin' | 'user'
}