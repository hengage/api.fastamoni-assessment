import { Module } from '@nestjs/common';
import {
  IdParamPipe,
  UserIdParamPipe,
  UuidValidationPipe,
} from './pipes/uuid-validation.pipes';
import { PROVIDER_TOKENS } from './constants';

@Module({
  providers: [
    {
      provide: PROVIDER_TOKENS.UUID_VALIDATION_PIPE,
      useClass: UuidValidationPipe,
    },
    { provide: PROVIDER_TOKENS.ID_PARAM_PIPE, useValue: IdParamPipe },
    { provide: PROVIDER_TOKENS.USER_ID_PARAM_PIPE, useValue: UserIdParamPipe },
  ],
  exports: [
    PROVIDER_TOKENS.UUID_VALIDATION_PIPE,
    PROVIDER_TOKENS.ID_PARAM_PIPE,
    PROVIDER_TOKENS.USER_ID_PARAM_PIPE,
  ],
})
export class CommonModule {}
