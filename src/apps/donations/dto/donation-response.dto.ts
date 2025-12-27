import { ApiProperty, OmitType } from '@nestjs/swagger';
import { ApiResponseDto } from 'src/common/dtos/api-response.dto';
import { DonationDto } from './donation.dto';

export class MakeDonationResponseData extends OmitType(DonationDto, [
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
export class MakeDonationResponseDto extends ApiResponseDto<MakeDonationResponseData> {
  @ApiProperty({
    type: () => MakeDonationResponseData,
    description: 'The donation data',
  })
  data: MakeDonationResponseData;
}

export class GetUserDonationStatsResponseDto extends ApiResponseDto<{
  sent: number;
  received: number;
}> {
  @ApiProperty({
    type: 'object',
    properties: {
      sent: {
        type: 'number',
        example: 5,
        description: 'Number of donations sent by the user',
      },
      received: {
        type: 'number',
        example: 3,
        description: 'Number of donations received by the user',
      },
    },
    description: 'The user donation statistics',
  })
  data: { sent: number; received: number };
}

class DonationUserDto {
  @ApiProperty({ description: 'User ID' })
  id: string;

  @ApiProperty({ description: 'First name' })
  firstName: string;

  @ApiProperty({ description: 'Last name' })
  lastName: string;

  @ApiProperty({ description: 'Email address' })
  email: string;
}

class DonationWalletDto {
  @ApiProperty({ description: 'Wallet ID' })
  id: string;

  @ApiProperty({ description: 'Wallet balance', type: String })
  balance: string;
}

class DonationDetailsResponseDataDto extends OmitType(DonationDto, [
  'donor',
  'beneficiary',
  'donorWallet',
  'beneficiaryWallet',
] as const) {
  @ApiProperty({ type: DonationUserDto })
  donor: DonationUserDto;

  @ApiProperty({ type: DonationUserDto })
  beneficiary: DonationUserDto;

  @ApiProperty({ type: DonationWalletDto })
  donorWallet: DonationWalletDto;

  @ApiProperty({ type: DonationWalletDto })
  beneficiaryWallet: DonationWalletDto;
}
export class GetDonationDetailResponseDto extends ApiResponseDto<DonationDetailsResponseDataDto> {
  @ApiProperty({
    type: DonationDetailsResponseDataDto,
    description: 'The donation details',
  })
  data: DonationDetailsResponseDataDto;
}
