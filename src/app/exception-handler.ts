import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { DomainException } from '../common/app-exception';
import {
  UserEmailAlreadyExistsException,
  UserEmailNotFoundException,
  UserIdNotFoundException,
} from './user/domain/user-exceptions';
import { logger } from '../common/logger';
import { InvalidTokenException } from './auth/domain/auth-exceptions';
import {
  ColocationNotFoundException,
  UserIsNotMemberOfColocationException,
} from './colocations/domain/colocation.exceptions';

interface HttpErrorResponse {
  status: number;
  message: string;
}

type ExceptionConstructor<T extends DomainException = DomainException> = new (...args: any[]) => T;

interface ExceptionHttpMapping {
  status: HttpStatus;
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

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      logger.error(`HTTP Exception: ${status}`, exceptionResponse);
      response.status(status).json(exceptionResponse);
      return;
    }

    logger.error(exception);
    response.status(500).json({ message: 'Internal server error' });
  }

  private mapDomainExceptionToHttp(exception: DomainException): HttpErrorResponse {
    // prettier-ignore
    // @formatter:off
    const mappings = new Map<ExceptionConstructor, ExceptionHttpMapping>([

      // Auth Exceptions
      [InvalidTokenException, { status: HttpStatus.UNAUTHORIZED, message: 'Invalid token' }],

      // Colocation Exceptions
      [ColocationNotFoundException, { status: HttpStatus.NOT_FOUND, message: 'This colocation does not exist' }],
      [UserIsNotMemberOfColocationException, { status: HttpStatus.FORBIDDEN, message: 'This user is not a member of this colocation', }],

      // User Exceptions
      [UserIdNotFoundException, { status: HttpStatus.NOT_FOUND, message: 'This user does not exist' }],
      [UserEmailNotFoundException, { status: HttpStatus.NOT_FOUND, message: 'This user does not exist' }],
      [UserEmailAlreadyExistsException, { status: HttpStatus.CONFLICT, message: 'Email already used' }],
    ]);
    // @formatter:on

    const result = this.handleKnownException(exception, mappings);
    if (result) return result;

    logger.error(exception);
    return { status: HttpStatus.INTERNAL_SERVER_ERROR, message: 'An unexpected error occurred' };
  }

  private handleKnownException<T extends DomainException>(
    exception: T,
    mapping: Map<ExceptionConstructor, ExceptionHttpMapping>
  ): HttpErrorResponse | null {
    const match = mapping.get(exception.constructor as ExceptionConstructor);
    return match ?? null;
  }
}
