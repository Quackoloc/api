import { DomainException } from '../../../common/app-exception';

export class AuthException extends DomainException {}

export class InvalidTokenException extends AuthException {
  constructor() {
    super(`Invalid token.`);
  }
}
