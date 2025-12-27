import { ApiProperty } from '@nestjs/swagger';
import { ApiResponseDto } from 'src/common/dtos/api-response.dto';
import { DonationDto } from './donation.dto';

class MakeDonationResponseDataDto {
  donation: Pick<
    DonationDto,
    | 'id'
    | 'amount'
    | 'transactionRef'
    | 'status'
    | 'message'
    | 'donor'
    | 'beneficiary'
    // | 'donorWallet'
    // | 'beneficiaryWallet'
    // | 'createdAt'
    // | 'updatedAt'
  >;
}

export class MakeDonationResponseDto extends ApiResponseDto<DonationDto> {
  @ApiProperty({
    type: () => DonationDto,
    description: 'Donation data',
  })
  data: DonationDto;
}
