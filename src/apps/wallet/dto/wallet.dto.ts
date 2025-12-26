import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, Matches, IsNotEmpty } from 'class-validator';
import { Msgs } from 'src/common/utils/messages.utils';

export class SetTransactionPinDto {
  @ApiProperty({
    example: '123456',
    description: '6-digit transaction PIN',
    minLength: 6,
    maxLength: 6,
  })
  @IsString()
  @Length(6, 6, { message: Msgs.requestValidation.EXACT_LENGTH('pin', 6) })
  @Matches(/^\d+$/, { message: Msgs.requestValidation.NUMERIC_ONLY('pin') })
  @IsNotEmpty({ message: Msgs.requestValidation.FIELD_REQUIRED('pin') })
  pin: string;
}
