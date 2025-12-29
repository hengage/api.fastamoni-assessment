import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsOptional, IsNumber, IsPositive, IsEnum } from 'class-validator';
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
  sortDirection?: SortDirection;
}
