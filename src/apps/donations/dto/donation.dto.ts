import { OmitType } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class DonationDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  id: string;

  @IsString()
  @IsNotEmpty()
  @IsUUID()
  beneficiaryId: string;

  @IsString()
  @IsNotEmpty()
  @IsUUID()
  donorId: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsOptional()
  message?: string;
}

export class MakeDonationDto extends OmitType(DonationDto, ['donorId']) {}
