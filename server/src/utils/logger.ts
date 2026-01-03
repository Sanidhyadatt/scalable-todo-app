import winston from 'winston';
import path from 'path';

const logFormat = winston.format.printf((info: any) => {
    const { level, message, timestamp } = info;
    return `${timestamp} [${level}]: ${message}`;
});

export const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        logFormat
    ),
    transports: [
        new winston.transports.File({ filename: path.join(__dirname, '../../logs/project_log.md') }),
    ],
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
        ),
    }));
}

export const stream = {
    write: (message: string) => {
        logger.info(message.trim());
    },
};
