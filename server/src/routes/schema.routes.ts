import { Router } from 'express';
import { registerSchema } from '../controllers/auth.controller';
import { taskSchema } from '../controllers/task.controller';
import fs from 'fs';
import path from 'path';

const router = Router();

router.get('/download', (req, res) => {
    try {
        const prismaSchemaPath = path.join(__dirname, '../../prisma/schema.prisma');
        const prismaSchema = fs.readFileSync(prismaSchemaPath, 'utf-8');

        // We can't easily serialize Zod objects to JSON without a dedicated library.
        // For now, we'll just send the Prisma schema and note that Zod schemas are used.
        const schemas = {
            prisma: prismaSchema,
            info: 'Zod schemas are currently used for validation on the server but are not easily serializable in this version.'
        };

        res.json(schemas);
    } catch (error: any) {
        res.status(500).json({ message: 'Failed to download schemas', error: error.message });
    }
});

export default router;
