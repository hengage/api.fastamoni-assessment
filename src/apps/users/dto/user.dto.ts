import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateUserDto {
  @IsEmail()
  @MaxLength(255)
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @MaxLength(100)
  @IsString()
  @Transform(({ value }: { value: string }) => value.trim())
  firstName: string;

  @MaxLength(100)
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: { value: string }) => value.trim())
  lastName: string;

  @MinLength(8)
  @MaxLength(128)
  @IsString()
  @IsNotEmpty()
  password: string;
}
