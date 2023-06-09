import { NextFunction, Request, Response } from "express";
import prisma from "../db";
import { comparePasswords, createJWT, hashPassword } from "../modules/auth";

export const creatNewUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = await prisma.user.create({
            data: {
                email: req.body.email,
                username: req.body.username,
                password: await hashPassword(req.body.password),
            },
        });
        const token = createJWT(user);
        res.json({ message: "User Created Succesfully", token });
    } catch (e) {
        e.type = "input";
        next(e);
    }
};

export const signIn = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = await prisma.user.findUnique({
            where: { username: req.body.username },
        });
        const isValid = await comparePasswords(
            req.body.password,
            user.password
        );

        if (!isValid) {
            res.status(401);
            res.json({ message: "NOPE" });
        }

        const token = createJWT(user);
        res.json({ message: "Succesfully signed in", token });
    } catch (e) {
        console.log(e);
    }
};
