import { BadRequestException, ParseUUIDPipe } from '@nestjs/common';
import { Msgs } from '../utils/messages.utils';

export class UuidValidationPipe extends ParseUUIDPipe {
  constructor(paramName?: string) {
    super({
      exceptionFactory: () =>
        new BadRequestException(Msgs.requestValidation.INVALID_UUID(paramName)),
    });
  }
}

export const IdParamPipe = new UuidValidationPipe('id');
export const UserIdParamPipe = new UuidValidationPipe('userId');
export const DonationIdParamPipe = new UuidValidationPipe('donationId');
export const WalletIdParamPipe = new UuidValidationPipe('walletId');
