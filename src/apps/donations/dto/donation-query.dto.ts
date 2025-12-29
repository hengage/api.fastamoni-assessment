import { ApiPropertyOptional, IntersectionType } from '@nestjs/swagger';
import { IsEnum, IsIn, IsOptional, IsString } from 'class-validator';
import { DONATION_FILTER_TYPES } from 'src/common/constants';
import {
  AmountRangeQueryDto,
  DateRangeQueryDto,
} from 'src/common/dtos/query-filter.dto';
import { DonationStatus } from 'src/common/enums';

export class DonationsListQueryDto extends IntersectionType(
  DateRangeQueryDto,
  AmountRangeQueryDto,
) {
  @ApiPropertyOptional({
    enum: Object.values(DONATION_FILTER_TYPES),
    description: 'Filter donations by direction for the current user',
    example: 'received',
  })
  @IsOptional()
  @IsIn(Object.values(DONATION_FILTER_TYPES))
  type?: DonationListType;

  @ApiPropertyOptional({
    enum: DonationStatus,
    description: 'Donation status',
    example: DonationStatus.SUCCESS,
  })
  @IsOptional()
  @IsEnum(DonationStatus)
  status?: DonationStatus;

  @ApiPropertyOptional({
    description: 'Filter by transaction reference',
    example: 'DON-1766837423825-938',
  })
  @IsOptional()
  @IsString()
  transactionRef?: string;
}
