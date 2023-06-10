import { NextFunction, Request, Response, RequestHandler } from "express";
import jwt, { Secret } from "jsonwebtoken";
import { User, AuthRequest } from "../types/types";
import bcrypt from "bcrypt";

export const comparePasswords = (password: string | Buffer, hashed: string) => {
    return bcrypt.compare(password, hashed);
};

export const hashPassword = (password: string | Buffer) => {
    return bcrypt.hash(password, 5);
};

export const createJWT = (user: User) => {
    const token = jwt.sign(
        { id: user.id, username: user.username },
        process.env.JWT_SECRET as Secret,
        { expiresIn: "1w" }
    );
    return token;
};

export const protect: RequestHandler = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    const bearer = req.headers.authorization;
    if (!bearer) {
        res.status(401);
        res.json({ message: "Not authorized" });
        return;
    }

    const [, token] = bearer.split(" ");
    if (!token) {
        res.status(401);
        res.json({ message: "Token Unvalid" });
        return;
    }

    try {
        const user = jwt.verify(
            token,
            process.env.JWT_SECRET as Secret
        ) as User;
        req.user = user;
        next();
    } catch (e) {
        console.error(e);
        res.status(401);
        res.json({ message: "Unvalid token or not verified" });
        return;
    }
};
