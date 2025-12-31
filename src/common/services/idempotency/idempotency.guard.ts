import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { HTTP_HEADERS } from 'src/common/constants';
import { Msgs } from 'src/common/utils/messages.utils';

@Injectable()
export class IdempotencyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<{
      headers: Record<typeof HTTP_HEADERS.IDEMPOTENCY_KEY, string>;
    }>();

    const idempotencyKey = request.headers[
      HTTP_HEADERS.IDEMPOTENCY_KEY.toLowerCase()
    ] as typeof HTTP_HEADERS.IDEMPOTENCY_KEY;

    if (!idempotencyKey) {
      throw new BadRequestException(
        Msgs.requestValidation.FIELD_REQUIRED('Idempotency-Key header'),
      );
    }
    return true;
  }
}
