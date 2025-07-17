import { NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { logger } from '../config/logger.config';

export class LoggerMiddleware implements NestMiddleware {
  use(request: Request, response: Response, next: NextFunction) {
    const start = process.hrtime();

    response.on('finish', () => {
      const { statusCode } = response;
      const [seconds, nanoseconds] = process.hrtime(start);
      const durationMs = (seconds * 1000 + nanoseconds / 1e6).toFixed(2);

      const content = `request=${request.method} path=${request.originalUrl} statusCode=${response.statusCode} durationMs=${durationMs}ms ip=${request.ip}`;

      if (statusCode < 400) {
        logger.log(content, 'HTTP');
      }

      if (statusCode >= 400 && statusCode < 500) {
        logger.warn(content, 'HTTP');
      }

      if (statusCode >= 500) {
        logger.error(content, 'HTTP');
      }
    });

    next();
  }
}
