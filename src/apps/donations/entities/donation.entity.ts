import { User } from 'src/apps/users/entities/user.entity';
import { Wallet } from 'src/apps/wallet/entities/wallet.entity';
import { DonationStatus } from 'src/common/enums';
import { BaseEntity } from 'src/common/models/base.entity';
import { Entity, Column, ManyToOne, JoinColumn, DeepPartial } from 'typeorm';

@Entity({ name: 'donations' })
export class Donation extends BaseEntity {
  @ManyToOne(() => User, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'donorId' })
  donor: DeepPartial<User>;

  @ManyToOne(() => User, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'beneficiaryId' })
  beneficiary: DeepPartial<User>;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount: number;

  @ManyToOne(() => Wallet, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'donorWalletId' })
  donorWallet: DeepPartial<Wallet>;

  @ManyToOne(() => Wallet, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'beneficiaryWalletId' })
  beneficiaryWallet: DeepPartial<Wallet>;

  @Column({ type: 'varchar', length: 50, unique: true })
  transactionRef: string;

  @Column({
    type: 'enum',
    enum: DonationStatus,
    default: DonationStatus.SUCCESS,
  })
  status: DonationStatus;

  @Column({ nullable: true })
  message?: string;
}
