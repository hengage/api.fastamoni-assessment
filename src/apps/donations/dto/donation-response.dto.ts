import { ApiProperty } from '@nestjs/swagger';
import { ApiResponseDto } from 'src/common/dtos/api-response.dto';
import { DonationDto } from './donation.dto';

export class MakeDonationResponseDto extends ApiResponseDto<DonationDto> {
  @ApiProperty({
    type: () => DonationDto,
    description: 'Donation data',
  })
  data: DonationDto;
}
