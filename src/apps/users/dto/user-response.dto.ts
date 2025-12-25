import { ApiProperty, OmitType } from '@nestjs/swagger';
import { ApiResponseDto } from 'src/common/dtos/api-response.dto';
import { User } from '../entities/user.entity';

export class UserResponseDto extends ApiResponseDto<Omit<User, 'password'>> {
  @ApiProperty({ type: () => OmitType(User, ['password'] as const) })
  data: User;
}
