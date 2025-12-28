import { BadRequestException, Injectable } from '@nestjs/common';
import { DATABASE_LOCK_MODES } from 'src/common/constants';
import { Msgs } from 'src/common/utils/messages.utils';
import { EntityManager, FindOptionsWhere } from 'typeorm';
import { Wallet } from './entities/wallet.entity';
import { WalletRepository } from './wallet.repository';

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

  async verifyTransactionPin(wallet: Wallet, pin: string): Promise<void> {
    console.log('Verifying PIN for wallet:', wallet.id, 'Provided PIN:', pin);
    console.log('Stored PIN hash:', wallet.transactionPin);
    if (!wallet.transactionPin) {
      throw new BadRequestException(Msgs.wallet.pin.NOT_SET());
    }
    const isPinValid = await wallet.validateTransactionPin(pin);
    if (!isPinValid) {
      throw new BadRequestException(Msgs.wallet.pin.INVALID());
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
      ['id', 'balance', 'transactionPin'],
      manager,
    );

    const secondWallet = await this.getWalletWithWriteLock(
      { user: { id: secondId } },
      ['id', 'balance', 'transactionPin'],
      manager,
    );

    return isDonorFirst
      ? { donorWallet: firstWallet, beneficiaryWallet: secondWallet }
      : { donorWallet: secondWallet, beneficiaryWallet: firstWallet };
  }

  async transferFundsInternally(
    fromUserId: ID,
    toUserId: ID,
    donorTransactionPin: string,
    amount: number,
    manager?: EntityManager,
  ) {
    const { donorWallet, beneficiaryWallet } = await this.getDonationWallets(
      fromUserId,
      toUserId,
      manager,
    );
    await this.verifyTransactionPin(donorWallet, donorTransactionPin);
    await this.debit(donorWallet, amount, manager);
    await this.credit(beneficiaryWallet, amount, manager);

    return { donorWallet, beneficiaryWallet };
  }
}
