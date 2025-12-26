import { ConflictException, Injectable } from '@nestjs/common';
import { AtomicTransactionService } from 'src/database/atomic-transaction.service';
import { EntityManager } from 'typeorm';
import { WalletService } from '../wallet/wallet.service';
import { CreateUserDto } from './dto/user.dto';
import { User } from './entities/user.entity';
import { IUsersService } from './interface/users.service.interface';
import { UsersRepository } from './users.repository';
import { Msgs } from 'src/common/utils/messages.utils';

@Injectable()
export class UsersService extends IUsersService {
  constructor(
    private readonly usersRepo: UsersRepository,
    private readonly walletService: WalletService,
    private readonly atomicTransaction: AtomicTransactionService,
  ) {
    super();
  }

  private async ensureEmailNotExists(email: string, manager?: EntityManager) {
    const existingUser = await this.usersRepo
      .findOneBy({ email }, ['email'], manager)
      .catch(() => null);
    if (existingUser) {
      throw new ConflictException(Msgs.users.EMAIL_ALREADY_EXISTS());
    }
  }

  async createUser(data: CreateUserDto): Promise<User> {
    return this.atomicTransaction.runInAtomic(async (txnManager) => {
      await this.ensureEmailNotExists(data.email, txnManager);
      const user = await this.usersRepo.createUser(data, txnManager);
      await this.walletService.createWallet(user.id, txnManager);

      return user;
    });
  }

  async findByEmail(email: string, manager?: EntityManager): Promise<User> {
    return this.usersRepo.findOneBy({ email }, undefined, manager);
  }

  async findById(id: string, manager?: EntityManager): Promise<User> {
    return this.usersRepo.findOneBy({ id }, undefined, manager);
  }

  async updateUser(
    id: string,
    data: Partial<User>,
    manager?: EntityManager,
  ): Promise<User> {
    return this.usersRepo.updateUser(id, data, manager);
  }
}
