import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DATA_SOURCE } from 'src/common/constants';
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
  ): Promise<Wallet> {
    const repo = manager?.getRepository(Wallet) ?? this.walletRepo;
    const wallet = await repo.findOne({ where: cond, select });

    if (!wallet) {
      throw new NotFoundException(`Wallet not found`);
    }

    return wallet;
  }

  async updateWallet(
    id: string,
    data: Partial<Wallet>,
    manager?: EntityManager,
  ) {
    const repo = manager?.getRepository(Wallet) ?? this.walletRepo;
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
