import { ApiProperty, OmitType } from '@nestjs/swagger';
import { ApiResponseDto } from 'src/common/dtos/api-response.dto';
import { DonationDto } from './donation.dto';

export class DonationResponseData extends OmitType(DonationDto, [
  'isActive',
  'beneficiary',
  'donor',
  'donorWallet',
  'beneficiaryWallet',
] as const) {
  donor: { id: string };
  beneficiary: { id: string };
  donorWallet: { id: string };
  beneficiaryWallet: { id: string };
}
export class MakeDonationResponseDto extends ApiResponseDto<DonationResponseData> {
  @ApiProperty({
    type: () => DonationResponseData,
    description: 'The donation data',
  })
  data: DonationResponseData;
}
