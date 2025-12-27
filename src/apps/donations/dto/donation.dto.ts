import { OmitType } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
import { Msgs } from 'src/common/utils/messages.utils';

export class DonationDto {
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsUUID()
  @IsNotEmpty()
  beneficiaryId: string;

  @IsString()
  @IsUUID()
  @IsNotEmpty()
  donorId: string;

  @Min(100, { message: Msgs.requestValidation.MIN_LENGTH('Amount', 100) })
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsOptional()
  @Min(1, { message: Msgs.requestValidation.MIN_LENGTH('Message', 4) })
  @Max(200, { message: Msgs.requestValidation.MAX_LENGTH('Message', 200) })
  // @IsNotEmpty({ message: 'Message cannot be empty' })
  message?: string;
}

export class MakeDonationDto extends OmitType(DonationDto, ['donorId', 'id']) {}
