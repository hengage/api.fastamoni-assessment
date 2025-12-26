import { Injectable, BadRequestException } from '@nestjs/common';
import { EntityManager, FindOptionsWhere } from 'typeorm';
import { WalletRepository } from './wallet.repository';
import { Wallet } from './entities/wallet.entity';
import { User } from '../users/entities/user.entity';
import { DATABASE_LOCK_MODES } from 'src/common/constants';

@Injectable()
export class WalletService {
  constructor(private readonly walletRepo: WalletRepository) {}

  async createWallet(userId: string, manager?: EntityManager): Promise<Wallet> {
    return this.walletRepo.createWallet(
      {
        user: { id: userId },
      },
      manager,
    );
  }

  async getWalletByUserId<K extends Keys<Wallet>>(
    userId: string,
    select?: K[],
    manager?: EntityManager,
  ): Promise<Wallet> {
    return this.walletRepo.findOneBy({ user: { id: userId } }, select, manager);
  }

  async setTransactionPin(
    walletId: string,
    pin: string,
    manager?: EntityManager,
  ): Promise<void> {
    await this.walletRepo.updateWallet(
      walletId,
      { transactionPin: pin },
      manager,
    );
  }

  async validateTransactionPin(
    userId: string,
    pin: string,
    manager?: EntityManager,
  ): Promise<void> {
    const wallet = await this.getWalletByUserId(
      userId,
      ['transactionPin'],
      manager,
    );
    if (!(await wallet.validateTransactionPin(pin))) {
      throw new BadRequestException('Invalid transaction pin');
    }
  }

  async credit(
    walletId: Wallet['id'],
    amount: number,
    manager?: EntityManager,
  ) {
    const wallet = await this.getWalletWithWriteLock(
      { id: walletId },
      ['id'],
      manager,
    );
    return this.walletRepo.credit(wallet.id, amount, manager);
  }

  async debit(walletId: Wallet['id'], amount: number, manager?: EntityManager) {
    await this.ensureSufficientBalance(walletId, amount, manager);
    return this.walletRepo.debit(walletId, amount, manager);
  }

  async ensureSufficientBalance(
    userId: User['id'],
    amount: number,
    manager?: EntityManager,
  ) {
    const wallet = await this.getWalletWithWriteLock(
      { user: { id: userId } },
      ['balance'],
      manager,
    );

    if (wallet.balance < amount) {
      throw new BadRequestException('Insufficient wallet balance');
    }
  }

  private async getWalletWithWriteLock(
    cond: FindOptionsWhere<Wallet> | FindOptionsWhere<Wallet>[],
    select?: Array<keyof Wallet>,
    manager?: EntityManager,
  ): Promise<Wallet> {
    return this.walletRepo.findOneBy(cond, select, manager, {
      mode: DATABASE_LOCK_MODES.PESSIMISTIC_WRITE,
    });
  }
}
