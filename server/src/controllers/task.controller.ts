import { Response } from 'express';
import prisma from '../prisma';
import { AuthRequest } from '../middleware/auth';
import { z } from 'zod';

export const taskSchema = z.object({
    title: z.string().min(1),
    description: z.string().optional(),
    status: z.enum(['pending', 'in-progress', 'completed']).optional(),
});

export const getTasks = async (req: AuthRequest, res: Response) => {
    try {
        const tasks = await prisma.task.findMany({
            where: { userId: req.user!.id },
            orderBy: { createdAt: 'desc' },
        });
        res.json(tasks);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const createTask = async (req: AuthRequest, res: Response) => {
    try {
        const result = taskSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({
                message: 'Validation failed',
                errors: result.error.issues.map(e => ({ path: e.path.join('.'), message: e.message }))
            });
        }
        const { title, description, status } = result.data;

        const task = await prisma.task.create({
            data: {
                title,
                description,
                status,
                userId: req.user!.id,
            },
        });
        res.status(201).json(task);
    } catch (error: any) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

export const updateTask = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { title, description, status } = taskSchema.partial().parse(req.body);

        const task = await prisma.task.update({
            where: { id, userId: req.user!.id },
            data: { title, description, status },
        });
        res.json(task);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteTask = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.task.delete({
            where: { id, userId: req.user!.id },
        });
        res.status(204).send();
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};
