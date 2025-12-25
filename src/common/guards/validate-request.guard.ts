import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  Type,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Request } from 'express';

/**
 * Validates request body against a DTO before it reaches the route handler.
 *
 * This guard was created to ensure request validation occurs before Passport's LocalStrategy
 * processes the request. This is particularly important for login endpoints where we want to
 * validate the request format (e.g., required email/password fields) before attempting
 * authentication.
 * @see https://docs.nestjs.com/recipes/passport#implementing-passport-local
 *
 * @example
 * ```typescript
 * @Post('login')
 * @UseGuards(new ValidateRequestGuard(LoginDto), LocalAuthGuard)
 * login(@Request() req) { ... }
 * ```
 *
 * Without this guard, invalid requests (like missing password field or wrong data type) would first reach the
 * LocalStrategy, causing unnecessary authentication attempts and potentially leaking
 * implementation details.
 *
 * @template T - The DTO class to validate the request body against
 *
 * */
@Injectable()
export class ValidateRequestGuard<T> implements CanActivate {
  constructor(@Inject('DTO_CLASS') private readonly dtoClass: Type<T>) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const dto = plainToInstance(this.dtoClass, request.body);
    const errors = await validate(dto as object);

    if (errors.length > 0) {
      const errorMessage = errors
        .map((error) => Object.values(error.constraints || {}))
        .flat()
        .join(', ');

      throw new BadRequestException(errorMessage);
    }
    return true;
  }
}
