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

  @MaxLength(100)
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @MaxLength(100)
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @MinLength(8)
  @MaxLength(128)
  @IsString()
  @IsNotEmpty()
  password: string;
}
