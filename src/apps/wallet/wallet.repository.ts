import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DATA_SOURCE } from 'src/common/constants';
import { Msgs } from 'src/common/utils/messages.utils';
import {
  DataSource,
  EntityManager,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { Wallet } from './entities/wallet.entity';

@Injectable()
export class WalletRepository {
  private readonly walletRepo: Repository<Wallet>;
  constructor(@Inject(DATA_SOURCE) private readonly dataSource: DataSource) {
    this.walletRepo = this.dataSource.getRepository(Wallet);
  }
  async createWallet(
    data: Partial<Wallet>,
    manager?: EntityManager,
  ): Promise<Wallet> {
    const repo = manager?.getRepository(Wallet) ?? this.walletRepo;
    const wallet = repo.create(data);
    return await repo.save(wallet);
  }

  async findOneBy<K extends Keys<Wallet>>(
    cond: FindOptionsWhere<Wallet> | FindOptionsWhere<Wallet>[],
    select?: K[],
    manager?: EntityManager,
    lock?: { mode: DatabaseLockMode },
  ): Promise<Wallet> {
    const repo = manager?.getRepository(Wallet) ?? this.walletRepo;
    const wallet = await repo.findOne({
      where: cond,
      ...(select && { select }),
      ...(lock && { lock }),
    });

    if (!wallet) {
      throw new NotFoundException(Msgs.common.NOT_FOUND('Wallet'));
    }

    return wallet;
  }

  async updateWallet(
    id: string,
    data: Partial<Wallet>,
    manager?: EntityManager,
  ) {
    const repo = manager?.getRepository(Wallet) ?? this.walletRepo;

    // Hash transaction PIN if provided, since repository.update() doesn't trigger entity hooks
    if (data.transactionPin) {
      const wallet = await this.findOneBy({ id }, ['transactionPin'], manager);
      wallet.transactionPin = data.transactionPin;
      await wallet.hashTransactionPin();
      data.transactionPin = wallet.transactionPin;
    }

    await repo.update(id, data);
    return repo.findOne({ where: { id } });
  }

  async credit(walletId: string, amount: number, manager?: EntityManager) {
    const repo = manager?.getRepository(Wallet) ?? this.walletRepo;
    return repo.increment({ id: walletId }, 'balance', amount);
  }

  async debit(walletId: string, amount: number, manager?: EntityManager) {
    const repo = manager?.getRepository(Wallet) ?? this.walletRepo;
    return repo.decrement({ id: walletId }, 'balance', amount);
  }
}
