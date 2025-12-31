import { Exclude } from 'class-transformer';
import { Wallet } from 'src/apps/wallet/entities/wallet.entity';
import { TABLE_NAMES } from 'src/common/constants';
import { BaseEntity } from 'src/common/entities/base.entity';
import { PasswordUtil } from 'src/common/utils/password.utils';
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToOne } from 'typeorm';

@Entity(TABLE_NAMES.USERS)
export class User extends BaseEntity {
  @Column({ length: 50 })
  firstName: string;

  @Column({ length: 50 })
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @OneToOne(() => Wallet, (wallet) => wallet.user)
  wallet: Wallet;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      this.password = await PasswordUtil.hash(this.password);
    }
  }

  async comparePassword(plain: string): Promise<boolean> {
    return PasswordUtil.compare(plain, this.password);
  }
}
