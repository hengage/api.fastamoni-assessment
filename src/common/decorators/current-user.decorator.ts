import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { User } from 'src/apps/users/entities/user.entity';

type UserAttributes = keyof User;

export const CurrentUserCtx = createParamDecorator(
  <K extends UserAttributes | undefined = undefined>(
    attribute: K,
    context: ExecutionContext,
  ): K extends UserAttributes ? User[K] | undefined : User | undefined => {
    const request = context.switchToHttp().getRequest<{ user?: User }>();
    const user = request.user;

    if (!user) {
      return undefined as K extends UserAttributes
        ? User[K] | undefined
        : undefined;
    }

    return (attribute ? user[attribute] : user) as K extends UserAttributes
      ? User[K]
      : User;
  },
);
