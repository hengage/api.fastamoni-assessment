import { Exclude } from 'class-transformer';
import { User } from 'src/apps/users/entities/user.entity';
import { TABLE_NAMES } from 'src/common/constants';
import { BaseEntity } from 'src/common/models/base.entity';
import { PasswordUtil } from 'src/common/utils/password.utils';
import { Column, DeepPartial, Entity, JoinColumn, OneToOne } from 'typeorm';

@Entity({ name: TABLE_NAMES.WALLET })
export class Wallet extends BaseEntity {
  @OneToOne(() => User, (user) => user.wallet, {
    eager: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: DeepPartial<User>;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  balance: number;

  @Column({ nullable: true })
  @Exclude()
  transactionPin?: string;

  async hashTransactionPin() {
    if (this.transactionPin) {
      this.transactionPin = await PasswordUtil.hash(this.transactionPin);
    }
  }

  async validateTransactionPin(pin: string): Promise<boolean> {
    if (!this.transactionPin) {
      return false;
    }
    return PasswordUtil.compare(pin, this.transactionPin);
  }
}
