import { PickType } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { User } from 'src/apps/users/entities/user.entity';
import { DonationStatus } from 'src/common/enums';
import { Msgs } from 'src/common/utils/messages.utils';
import { BaseEntityDto } from 'src/common/dtos/base-entity.dto';
import { Wallet } from 'src/apps/wallet/entities/wallet.entity';

export class DonationDto extends BaseEntityDto {
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @Min(100)
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsEnum(DonationStatus)
  @IsString()
  @IsNotEmpty()
  status: DonationStatus;

  @IsString()
  @IsNotEmpty()
  transactionRef: string;

  @IsNotEmpty()
  @IsString()
  @IsNotEmpty()
  donor: User;

  @IsNotEmpty()
  @IsString()
  @IsNotEmpty()
  beneficiary: User;

  @IsNotEmpty()
  @IsString()
  @IsNotEmpty()
  donorWallet: Wallet;

  @IsNotEmpty()
  @IsString()
  @IsNotEmpty()
  beneficiaryWallet: Wallet;

  @IsString()
  @IsOptional()
  @MinLength(4, { message: Msgs.requestValidation.MIN_LENGTH('Message', 4) })
  @MaxLength(200, {
    message: Msgs.requestValidation.MAX_LENGTH('Message', 200),
  })
  message?: string;
}

export class MakeDonationDto extends PickType(DonationDto, [
  'amount',
  'message',
] as const) {
  @IsUUID()
  @IsNotEmpty()
  beneficiaryId: string;
}
