import { DomainException } from '../../../common/app-exception';

export class ColocationExceptions extends DomainException {}

export class ColocationNotFoundException extends ColocationExceptions {
  constructor(public readonly id: number) {
    super(`Colocation with id: ${id} not found.`);
  }
}

export class UserIsNotMemberOfColocationException extends ColocationExceptions {
  constructor(
    public readonly colocationId: number,
    public readonly userId: number
  ) {
    super(`User with id: ${userId} is not a member of colocation with id: ${colocationId}.`);
  }
}

export class ColocationCodeNotFoundException extends ColocationExceptions {
  constructor(public readonly code: string) {
    super(`Colocation code ${code} not found.`);
  }
}

export class InvitationCodeNotFoundException extends ColocationExceptions {
  constructor(public readonly code: string) {
    super(`Invitation code ${code} not found.`);
  }
}

export class UserIsAlreadyMemberOfColocationException extends ColocationExceptions {
  constructor(public readonly userId: number) {
    super(`User with id: ${userId} is already a member of a colocation.`);
  }
}

// todo: move to colocation task exceptions (should have been moved with tasks module with tasks have been separated from colocation module)
export class ColocationTaskNotFoundException extends ColocationExceptions {
  constructor(public readonly id: number) {
    super(`Colocation task with id: ${id} not found.`);
  }
}

export class MembersNotFoundException extends ColocationExceptions {
  constructor(
    public readonly colocationId: number,
    public readonly memberId: number
  ) {
    super(`Member with id : ${memberId} not found in colocation with id ${colocationId}.`);
  }
}

export class UserTaskPreferenceNotFoundException extends ColocationExceptions {
  constructor(public readonly id: number) {
    super(`User task preference with id: ${id} not found.`);
  }
}

export class CannotCreateUserTaskPreferenceException extends ColocationExceptions {
  constructor(public readonly taskId: number) {
    super(
      `Cannot create user task preference for task with id : ${taskId} because task is not recurrent.`
    );
  }
}
