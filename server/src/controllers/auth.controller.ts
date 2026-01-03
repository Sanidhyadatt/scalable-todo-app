import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../prisma';
import { z } from 'zod';

export const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().optional(),
});

export const register = async (req: Request, res: Response) => {
    try {
        const result = registerSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({
                message: 'Validation failed',
                errors: result.error.issues.map(e => ({ path: e.path.join('.'), message: e.message }))
            });
        }
        const { email, password, name } = result.data;

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: { email, password: hashedPassword, name },
        });

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, { expiresIn: '1d' });
        res.status(201).json({ user: { id: user.id, email: user.email, name: user.name }, token });
    } catch (error: any) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, { expiresIn: '1d' });
        res.json({ user: { id: user.id, email: user.email, name: user.name }, token });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getProfile = async (req: any, res: Response) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: { id: true, email: true, name: true, createdAt: true },
        });
        res.json(user);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const updateProfileSchema = z.object({
    email: z.string().email().optional(),
    name: z.string().optional(),
});

export const updateProfile = async (req: any, res: Response) => {
    try {
        const result = updateProfileSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({
                message: 'Validation failed',
                errors: result.error.issues.map(e => ({ path: e.path.join('.'), message: e.message }))
            });
        }
        const { email, name } = result.data;

        if (email) {
            const existingUser = await prisma.user.findUnique({ where: { email } });
            if (existingUser && existingUser.id !== req.user.id) {
                return res.status(400).json({ message: 'Email already taken' });
            }
        }

        const user = await prisma.user.update({
            where: { id: req.user.id },
            data: { email, name },
            select: { id: true, email: true, name: true }
        });

        res.json({ message: 'Profile updated successfully', user });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const changePasswordSchema = z.object({
    currentPassword: z.string(),
    newPassword: z.string().min(6),
});

export const changePassword = async (req: any, res: Response) => {
    try {
        const result = changePasswordSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({
                message: 'Validation failed',
                errors: result.error.issues.map(e => ({ path: e.path.join('.'), message: e.message }))
            });
        }
        const { currentPassword, newPassword } = result.data;

        const user = await prisma.user.findUnique({ where: { id: req.user.id } });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid current password' });

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await prisma.user.update({
            where: { id: req.user.id },
            data: { password: hashedPassword }
        });

        res.json({ message: 'Password changed successfully' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
