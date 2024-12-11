import { Request } from "express";



export interface customRequestWithPayload extends Request{
    payload?:{
        id:string;
        role:string;
    }
}