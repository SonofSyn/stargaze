import winston, { createLogger, format, transports } from 'winston';

const { combine, timestamp, printf, colorize } = format;
const myFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level}]: ${message}`;
});

export function createServerLogger() {
    return createLogger({
        level: 'info', // Set the minimum log level
        format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), myFormat),
        transports: [
            // Console transport with colors
            new transports.Console({
                format: combine(
                    colorize({ all: true }), // This will colorize the entire line
                    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                    myFormat
                ),
            }),
            // You can add file transport if needed
            // new transports.File({ filename: 'error.log', level: 'error' }),
            // new transports.File({ filename: 'combined.log' })
        ],
    });
}
