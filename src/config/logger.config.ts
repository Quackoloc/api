import * as winston from 'winston';
import { transports } from 'winston';
import { WinstonModule } from 'nest-winston';
import * as Process from 'node:process';

const shouldLog = Process.env.NODE_ENV !== 'test';

export const logger = WinstonModule.createLogger({
  level: shouldLog ? 'info' : 'silent',
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
