"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const router = (0, express_1.Router)();
router.get('/download', (req, res) => {
    try {
        const prismaSchemaPath = path_1.default.join(__dirname, '../../prisma/schema.prisma');
        const prismaSchema = fs_1.default.readFileSync(prismaSchemaPath, 'utf-8');
        // We can't easily serialize Zod objects to JSON without a dedicated library.
        // For now, we'll just send the Prisma schema and note that Zod schemas are used.
        const schemas = {
            prisma: prismaSchema,
            info: 'Zod schemas are currently used for validation on the server but are not easily serializable in this version.'
        };
        res.json(schemas);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to download schemas', error: error.message });
    }
});
exports.default = router;
