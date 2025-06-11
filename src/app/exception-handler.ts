import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { Response } from 'express';
import { DomainException } from '../common/app-exception';
import {
  UserEmailAlreadyExistsException,
  UserEmailNotFoundException,
  UserIdNotFoundException,
} from './user/domain/user-exceptions';
import { logger } from '../common/logger';

interface HttpErrorResponse {
  status: number;
  message: string;
}

@Catch()
export class ExceptionHandler implements ExceptionFilter {
  catch(exception: Error | HttpException | DomainException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof DomainException) {
      const { status, message } = this.mapDomainExceptionToHttp(exception);
      response.status(status).json({ message });
      return;
    }

    logger.error(`Unmapped exception: ${exception}`);
    response.status(500).json({ message: 'Internal server error' });
  }

  private mapDomainExceptionToHttp(exception: DomainException): HttpErrorResponse {
    if (exception instanceof UserIdNotFoundException)
      return { status: 404, message: `This user does not exists` };

    if (exception instanceof UserEmailNotFoundException)
      return { status: 404, message: `This user does not exists` };

    if (exception instanceof UserEmailAlreadyExistsException)
      return { status: 404, message: `Email already used` };

    logger.error(`Unhandled exception: ${exception.name}`);

    return { status: 500, message: 'An unexpected error occurred' };
  }
}
