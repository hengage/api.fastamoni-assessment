import { TABLE_NAMES } from 'src/common/constants';
import { BaseEntity } from 'src/common/entities/base.entity';
import { Column, Entity, Index } from 'typeorm';

@Entity({ name: TABLE_NAMES.IDEMPOTENCY_KEYS })
@Index('IDX_idempotency_key', ['key'])
export class IdempotencyKey extends BaseEntity {
  @Column({ type: 'varchar', length: 255, unique: true })
  key: string;

  @Column({ type: 'varchar', length: 255 })
  requestPath: string;

  @Column({ type: 'varchar', length: 255 })
  userId: string;

  @Column({ type: 'json' })
  response: any;

  @Column({
    type: 'timestamp',
    default: () => 'DATE_ADD(NOW(), INTERVAL 24 HOUR)',
  })
  expiresAt: Date;
}
