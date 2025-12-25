import { ApiProperty } from '@nestjs/swagger';
import { ApiResponseDto } from 'src/common/dtos/api-response.dto';

class LoginDataDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT access token',
  })
  accessToken: string;
}

export class LoginResponseDto extends ApiResponseDto<LoginDataDto> {
  @ApiProperty({ type: LoginDataDto })
  data: LoginDataDto;
}
