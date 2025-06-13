import { ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { InvalidTokenException } from '../src/app/auth/domain/auth-exceptions';
import { logger } from '../src/common/logger';
import {
  ColocationNotFoundException,
  UserIsNotMemberOfColocationException,
} from '../src/app/colocations/domain/colocation.exceptions';
import {
  UserEmailAlreadyExistsException,
  UserEmailNotFoundException,
  UserIdNotFoundException,
} from '../src/app/user/domain/user-exceptions';
import { DomainException } from '../src/common/app-exception';
import { ExceptionHandler } from '../src/app/exception-handler';

jest.mock('../src/common/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
  },
}));

describe('ExceptionHandler', () => {
  let handler: ExceptionHandler;
  let mockResponse: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;
  let mockHost: Partial<ArgumentsHost>;

  beforeEach(() => {
    handler = new ExceptionHandler();

    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });

    mockResponse = {
      status: statusMock,
    };

    mockHost = {
      switchToHttp: jest.fn().mockReturnValue({
        getResponse: () => mockResponse,
      }),
    };
  });

  describe('catch', () => {
    it('should handle known DomainException', () => {
      const exception = new InvalidTokenException();

      handler.catch(exception, mockHost as ArgumentsHost);

      expect(statusMock).toHaveBeenCalledWith(HttpStatus.UNAUTHORIZED);
      expect(jsonMock).toHaveBeenCalledWith({ message: 'Invalid token' });
    });

    it('should handle HttpException', () => {
      const exception = new HttpException({ error: 'Bad Request' }, HttpStatus.BAD_REQUEST);

      handler.catch(exception, mockHost as ArgumentsHost);

      expect(logger.error).toHaveBeenCalledWith('HTTP Exception: 400', { error: 'Bad Request' });
      expect(statusMock).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Bad Request' });
    });

    it('should handle unknown exceptions with 500', () => {
      const exception = new Error('Unknown error');

      handler.catch(exception, mockHost as ArgumentsHost);

      expect(logger.error).toHaveBeenCalledWith(exception);
      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({ message: 'Internal server error' });
    });
  });

  describe('mapDomainExceptionToHttp', () => {
    it('should return correct mapping for each known exception', () => {
      const mappings = [
        {
          ex: new InvalidTokenException(),
          status: HttpStatus.UNAUTHORIZED,
          message: 'Invalid token',
        },
        {
          ex: new ColocationNotFoundException(1),
          status: HttpStatus.NOT_FOUND,
          message: 'This colocation does not exist',
        },
        {
          ex: new UserIsNotMemberOfColocationException(1, 2),
          status: HttpStatus.FORBIDDEN,
          message: 'This user is not a member of this colocation',
        },
        {
          ex: new UserIdNotFoundException(1),
          status: HttpStatus.NOT_FOUND,
          message: 'This user does not exist',
        },
        {
          ex: new UserEmailNotFoundException('john@doe.fr'),
          status: HttpStatus.NOT_FOUND,
          message: 'This user does not exist',
        },
        {
          ex: new UserEmailAlreadyExistsException('john@doe.fr'),
          status: HttpStatus.CONFLICT,
          message: 'Email already used',
        },
      ];

      for (const { ex, status, message } of mappings) {
        const result = (handler as any).mapDomainExceptionToHttp(ex);
        expect(result).toEqual({ status, message });
      }
    });

    it('should return 500 for unknown DomainException', () => {
      class UnknownException extends DomainException {
        constructor(message?: string) {
          super(message);
        }
      }

      const ex = new UnknownException('test');

      const result = (handler as any).mapDomainExceptionToHttp(ex);

      expect(logger.error).toHaveBeenCalledWith(ex);
      expect(result).toEqual({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'An unexpected error occurred',
      });
    });
  });

  describe('handleKnownException', () => {
    it('should return mapping if found', () => {
      const mapping = new Map();
      mapping.set(InvalidTokenException, { status: 401, message: 'Invalid token' });

      const result = (handler as any).handleKnownException(new InvalidTokenException(), mapping);
      expect(result).toEqual({ status: 401, message: 'Invalid token' });
    });

    it('should return null if no mapping found', () => {
      const mapping = new Map();

      const result = (handler as any).handleKnownException(new InvalidTokenException(), mapping);
      expect(result).toBeNull();
    });
  });
});
