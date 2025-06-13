import { createLogger, format, transports } from 'winston';

const { combine, timestamp, printf, colorize, errors } = format;

export const logger = createLogger({
  level: 'info',
  format: combine(
    colorize({ all: true }),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }),
    printf(({ timestamp, level, message, stack }) => {
      return stack
        ? `${level}: ${timestamp} ${message}\n${stack}`
        : `${level}: ${timestamp} ${message}`;
    })
  ),
  transports: [new transports.Console()],
});
