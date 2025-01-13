import { AppException } from '../../common/app-exception';
import { HttpStatus } from '@nestjs/common';

export class UsersException extends AppException {}

export class UserNotFoundException extends UsersException {
  public static idNotFound(id: string): UserNotFoundException {
    return new UserNotFoundException(`User with id: ${id} not found.`, HttpStatus.NOT_FOUND);
  }

  public static emailNotFound(email: string): UserNotFoundException {
    return new UserNotFoundException(`User with email: ${email} not found.`, HttpStatus.NOT_FOUND);
  }
}

export class UserCannotBeCreatedException extends UsersException {
  public static emailAlreadyExists(email: string): UserCannotBeCreatedException {
    return new UserCannotBeCreatedException(
      `User with email: ${email} already exists.`,
      HttpStatus.CONFLICT
    );
  }
}
