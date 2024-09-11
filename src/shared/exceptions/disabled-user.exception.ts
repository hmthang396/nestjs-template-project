import { ErrorType } from '@shared/common/enums';
import { UnauthorizedException } from '@nestjs/common';

export class DisabledUserException extends UnauthorizedException {
  constructor(errorType: ErrorType, username) {
    super({
      errorType,
      message: 'validation.login.user_inactive',
      args: {
        username: username,
      },
    });
  }
}
