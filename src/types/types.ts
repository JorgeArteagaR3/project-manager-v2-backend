import { Request } from "express";
import prisma from "../db";

export interface User {
    id: string;
    email: String;
    username: string;
    password: string;
}

export interface AuthRequest extends Request {
    user?: User;
}
