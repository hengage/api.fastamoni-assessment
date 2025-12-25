import { ApiProperty } from '@nestjs/swagger';

export class ApiResponseDto<T = undefined> {
  @ApiProperty()
  success: true | false;

  @ApiProperty()
  message: string;

  @ApiProperty()
  data: T;

  constructor(partial: Partial<ApiResponseDto<T>>) {
    Object.assign(this, partial);
  }
}
