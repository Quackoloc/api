import { DomainException } from '../../../common/app-exception';

export class UserException extends DomainException {}

export class UserIdNotFoundException extends UserException {
  constructor(public readonly id: number) {
    super(`User with id: ${id} not found.`);
  }
}

export class UserEmailNotFoundException extends UserException {
  constructor(public readonly email: string) {
    super(`User with email: ${email} not found.`);
  }
}

export class UserEmailAlreadyExistsException extends UserException {
  constructor(public readonly email: string) {
    super(`User with email: ${email} already exists.`);
  }
}

export class InvalidResetTokenException extends UserException {
  constructor() {
    super('Invalid or expired password reset token');
  }
}
