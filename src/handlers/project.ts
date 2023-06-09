import { NextFunction, Response } from "express";
import prisma from "../db";
import { AuthRequest } from "../types/types";

export const getallProjects = async (req: AuthRequest, res: Response) => {
    try {
        const projects = await prisma.project.findMany({
            where: { belongsToId: req.user.id },
        });
        res.json({ data: projects });
    } catch (e) {
        console.log(e);
    }
};

export const createProject = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const project = await prisma.project.create({
            data: {
                name: req.body.name,
                description: req.body.description,
                belongsToId: req.user.id,
            },
        });

        res.json({ data: project });
    } catch (e) {
        next(e);
    }
};

export const updateProject = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const project = await prisma.project.update({
            where: {
                id_belongsToId: {
                    belongsToId: req.user.id,
                    id: req.params.id,
                },
            },
            data: {
                name: req.body.name,
                description: req.body.description,
            },
        });

        res.json({ data: project });
    } catch (e) {
        next(e);
    }
};

export const getOneProject = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const project = await prisma.project.findFirst({
            where: { belongsToId: req.user.id, id: req.params.id },
            include: { tasks: true },
        });

        res.json({ data: project });
    } catch (e) {
        next(e);
    }
};

export const deleteProject = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const project = await prisma.project.delete({
            where: {
                id_belongsToId: {
                    belongsToId: req.user.id,
                    id: req.params.id,
                },
            },
        });

        res.json({ data: project });
    } catch (e) {
        next(e);
    }
};
