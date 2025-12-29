import { ApiProperty, ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsOptional,
  IsNumber,
  IsPositive,
  IsEnum,
  IsString,
} from 'class-validator';
import { DEFAULT_PAGINATION, SORT_DIRECTIONS } from '../constants';

export class PaginationDto {
  @ApiProperty({ required: false, description: 'Page number for pagination' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  page?: number;

  @ApiProperty({ required: false, description: 'Number of items per page' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  limit?: number;

  @ApiProperty({
    required: false,
    enum: SORT_DIRECTIONS,
    default: DEFAULT_PAGINATION.sortDirection,
  })
  @IsOptional()
  @IsEnum(SORT_DIRECTIONS)
  @Transform(
    ({ value }: { value: string }) => value?.toUpperCase() as SortDirection,
  )
  sortDirection?: SortDirection = SORT_DIRECTIONS.DESC;
}

export class CursorPaginationDto extends OmitType(PaginationDto, ['page']) {
  @ApiPropertyOptional({
    description: 'Primary cursor for pagination (timestamp)',
    example: '2025-12-15T10:30:00.000Z',
    format: 'date-time',
  })
  @IsOptional()
  @IsString()
  primaryCursor?: string;

  @ApiPropertyOptional({
    description: 'Secondary cursor for pagination (ID)',
    example: '6c032882-da4f-4821-a395-8a36fb0405ef',
    format: 'uuid',
  })
  @IsOptional()
  @IsString()
  secondaryCursor?: string;
}

export class CursorPaginationResponseDto {
  @ApiPropertyOptional({ description: 'Next primary cursor for pagination' })
  primaryCursor?: string;

  @ApiPropertyOptional({ description: 'Next secondary cursor for pagination' })
  secondaryCursor?: string;

  @ApiProperty({ description: 'Whether there are more items' })
  hasMore: boolean;
}
