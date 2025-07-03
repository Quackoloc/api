import * as winston from 'winston';
import { transports } from 'winston';
import { WinstonModule } from 'nest-winston';

export const logger = WinstonModule.createLogger({
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

export const winstonConfig = {
  logger,
};
