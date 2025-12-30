// src/common/dtos/base-entity.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../entities/base.entity';

export class BaseEntityDto implements Partial<BaseEntity> {
  @ApiProperty({ description: 'Unique identifier' })
  id: string;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date;

  @ApiProperty({ description: 'Soft delete flag' })
  isActive: boolean;
}

// Then in your response DTOs, extend this base DTO
export class UserIdDto extends BaseEntityDto {
  @ApiProperty({ description: 'User ID' })
  id: string;
}

export class WalletIdDto extends BaseEntityDto {
  @ApiProperty({ description: 'Wallet ID' })
  id: string;
}
