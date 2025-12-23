import { TABLE_NAMES } from 'src/common/constants';
import { BaseEntity } from 'src/common/models/base.entity';
import { Column, Entity } from 'typeorm';

@Entity(TABLE_NAMES.USERS)
export class User extends BaseEntity {
  @Column({ length: 50 })
  firstName: string;

  @Column({ length: 50 })
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  transactionPin?: string;
}
