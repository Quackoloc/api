import { AppException } from '../../app-exception';
import { HttpStatus } from '@nestjs/common';

export class AuthException extends AppException {}

export class LoginFailedException extends AuthException {
  public static wrongPassword(login: string): LoginFailedException {
    return new LoginFailedException(
      `User attempted to login with login "${login}" and a wrong password.`,
      HttpStatus.UNAUTHORIZED,
    );
  }

  public static unknownLogin(login: string): LoginFailedException {
    return new LoginFailedException(
      `A user attempted to login with an unknown login : "${login}".`,
      HttpStatus.NOT_FOUND,
    );
  }
}
