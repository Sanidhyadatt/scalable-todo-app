"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.updateTask = exports.createTask = exports.getTasks = exports.taskSchema = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const zod_1 = require("zod");
exports.taskSchema = zod_1.z.object({
    title: zod_1.z.string().min(1),
    description: zod_1.z.string().optional(),
    status: zod_1.z.enum(['pending', 'in-progress', 'completed']).optional(),
});
const getTasks = async (req, res) => {
    try {
        const tasks = await prisma_1.default.task.findMany({
            where: { userId: req.user.id },
            orderBy: { createdAt: 'desc' },
        });
        res.json(tasks);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getTasks = getTasks;
const createTask = async (req, res) => {
    try {
        const result = exports.taskSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({
                message: 'Validation failed',
                errors: result.error.issues.map(e => ({ path: e.path.join('.'), message: e.message }))
            });
        }
        const { title, description, status } = result.data;
        const task = await prisma_1.default.task.create({
            data: {
                title,
                description,
                status,
                userId: req.user.id,
            },
        });
        res.status(201).json(task);
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};
exports.createTask = createTask;
const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, status } = exports.taskSchema.partial().parse(req.body);
        const task = await prisma_1.default.task.update({
            where: { id, userId: req.user.id },
            data: { title, description, status },
        });
        res.json(task);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.updateTask = updateTask;
const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma_1.default.task.delete({
            where: { id, userId: req.user.id },
        });
        res.status(204).send();
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.deleteTask = deleteTask;
