import { AppException } from '../../common/app-exception';
import { HttpStatus } from '@nestjs/common';

export class AuthException extends AppException {
  public static invalidToken(): AuthException {
    return new AuthException(`Invalid token.`, HttpStatus.UNAUTHORIZED);
  }
}
