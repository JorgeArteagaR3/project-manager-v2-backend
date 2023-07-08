import { NextFunction, Request, Response } from "express";
import prisma from "../db";
import { comparePasswords, createJWT, hashPassword } from "../modules/auth";
import { AuthRequest } from "../types/types";

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
        next(e);
    }
};

export const signIn = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = await prisma.user.findUnique({
            where: { username: req.body.username },
        });
        if (!user) {
            res.status(401);
            return res.json({ message: "This user doesn't exist" });
        }
        const isValid = await comparePasswords(
            req.body.password,
            user!.password
        );

        if (!isValid) {
            res.status(401);
            return res.json({ message: "Invalid Password" });
        }

        const token = createJWT(user!);
        res.json({ message: "Succesfully signed in", token });
    } catch (e) {
        next(e);
    }
};

export const getUser = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user?.id },
        });
        if (!user) {
            return res.json({ message: "No user found" });
        }
        res.json({ data: user });
    } catch (e) {
        next(e);
    }
};

export const updateUser = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.params.id },
        });

        const isValid = await comparePasswords(
            req.body.password,
            user!.password
        );

        if (!isValid) {
            res.status(401);
            return res.json({ message: "Invalid Password" });
        }

        if (req.body.email) {
            const updatedUser = await prisma.user.update({
                where: { username: user?.username },
                data: {
                    email: req.body.email,
                },
            });
            res.json({ data: updatedUser });
        } else {
            const isSamePassword = await comparePasswords(
                req.body.newpassword,
                user?.password!
            );

            if (isSamePassword) {
                res.status(400);
                return res.json({ message: "Cannot put same password" });
            }

            const updatedUser = await prisma.user.update({
                where: { username: user?.username },
                data: {
                    password: await hashPassword(req.body.newpassword),
                },
            });
            res.json({ data: updatedUser });
        }
    } catch (e) {
        next(e);
    }
};
