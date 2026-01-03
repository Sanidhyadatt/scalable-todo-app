import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { logger, stream } from './utils/logger';
import authRoutes from './routes/auth.routes';
import taskRoutes from './routes/task.routes';
import schemaRoutes from './routes/schema.routes';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(morgan('combined', { stream }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/schemas', schemaRoutes);

app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    logger.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
});
