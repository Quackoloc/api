import * as winston from 'winston';
import { createLogger, transports } from 'winston';

export const logger = createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.colorize(),
    winston.format.printf(({ timestamp, level, message, stack }) => {
      return stack ? `${timestamp} ${level}: ${stack}` : `${timestamp} ${level}: ${message}`;
    })
  ),
  transports: [new transports.Console()],
});
