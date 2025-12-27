import { BadRequestException, Injectable } from '@nestjs/common';
import { DATABASE_LOCK_MODES } from 'src/common/constants';
import { EntityManager, FindOptionsWhere } from 'typeorm';
import { Wallet } from './entities/wallet.entity';
import { WalletRepository } from './wallet.repository';
import { Msgs } from 'src/common/utils/messages.utils';

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

  async debit(wallet: Wallet, amount: number, manager?: EntityManager) {
    if (wallet.balance < amount) {
      throw new BadRequestException(Msgs.wallet.INSUFFICIENT_BALANCE());
    }
    return this.walletRepo.debit(wallet.id, amount, manager);
  }

  async credit(wallet: Wallet, amount: number, manager?: EntityManager) {
    return this.walletRepo.credit(wallet.id, amount, manager);
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

  async getDonationWallets(
    donorId: ID,
    beneficiaryId: ID,
    manager?: EntityManager,
  ): Promise<{ donorWallet: Wallet; beneficiaryWallet: Wallet }> {
    // Determine lock order
    const [firstId, secondId] = [donorId, beneficiaryId].sort();
    const isDonorFirst = firstId === donorId;

    const firstWallet = await this.getWalletWithWriteLock(
      { user: { id: firstId } },
      ['id', 'balance'],
      manager,
    );

    const secondWallet = await this.getWalletWithWriteLock(
      { user: { id: secondId } },
      ['id', 'balance'],
      manager,
    );

    return isDonorFirst
      ? { donorWallet: firstWallet, beneficiaryWallet: secondWallet }
      : { donorWallet: secondWallet, beneficiaryWallet: firstWallet };
  }

  async transferFundsInternally(
    fromUserId: ID,
    toUserId: ID,
    amount: number,
    manager?: EntityManager,
  ) {
    const { donorWallet, beneficiaryWallet } = await this.getDonationWallets(
      fromUserId,
      toUserId,
      manager,
    );
    await this.debit(donorWallet, amount, manager);
    await this.credit(beneficiaryWallet, amount, manager);

    return { donorWallet, beneficiaryWallet };
  }
}
