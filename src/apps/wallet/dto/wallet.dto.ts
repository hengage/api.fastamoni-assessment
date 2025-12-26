import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, Matches, IsNotEmpty } from 'class-validator';

export class SetTransactionPinDto {
  @ApiProperty({
    example: '123456',
    description: '6-digit transaction PIN',
    minLength: 6,
    maxLength: 6,
  })
  @IsString()
  @Length(6, 6, { message: 'PIN must be exactly 6 digits' })
  @Matches(/^\d+$/, { message: 'PIN must contain only numbers' })
  @IsNotEmpty({ message: 'PIN is required' })
  pin: string;
}
