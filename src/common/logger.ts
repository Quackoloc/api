import { createLogger, format, transports } from 'winston';

const { combine, timestamp, printf, colorize, errors } = format;

export const logger = createLogger({
  level: 'info',
  format: combine(
    colorize({ all: true }),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level}] ${message}`;
    })
  ),
  transports: [new transports.Console()],
});
