import { Response } from "express";
import { AuthRequest } from "../types/types";
import prisma from "../db";

export const createTask = async (req: AuthRequest, res: Response) => {
    const project = await prisma.project.findFirst({
        where: { id: req.body.projectId },
    });

    if (!project) {
        return res.json({
            message:
                "This project doesn't belong to the user sending the information",
        });
    }

    const createdTask = await prisma.task.create({
        data: {
            title: req.body.title,
            description: req.body.description,
            project: { connect: { id: project.id } },
        },
    });
    res.json({ data: createdTask });
};

export const updateTask = async (req: AuthRequest, res: Response) => {
    const projects = await prisma.project.findMany({
        where: { belongsToId: req.user.id },
        include: { tasks: true },
    });

    const tasks = projects.flatMap((proyect) => proyect.tasks);

    const match = tasks.find((task) => task.id === req.params.id);

    if (!match) {
        return res.json({ message: "This task doesn't exist" });
    }

    const task = await prisma.task.update({
        where: { id: req.params.id },
        data: req.body,
    });

    res.json({ data: task });
};

export const deleteTask = async (req: AuthRequest, res: Response) => {
    const projects = await prisma.project.findMany({
        where: { belongsToId: req.user.id },
        include: { tasks: true },
    });

    const tasks = projects.flatMap((proyect) => proyect.tasks);

    const match = tasks.find((task) => task.id === req.params.id);

    if (!match) {
        return res.json({ message: "This task doesn't exist" });
    }

    const task = await prisma.task.delete({
        where: { id: req.params.id },
    });
    res.json({ data: task });
};
