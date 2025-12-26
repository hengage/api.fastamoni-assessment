import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  DataSource,
  EntityManager,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { User } from './entities/user.entity';
import { DatabaseLockMode, Keys } from 'src/types';

@Injectable()
export class UsersRepository {
  private readonly userRepo: Repository<User>;

  constructor(@Inject('DATA_SOURCE') private readonly dataSource: DataSource) {
    this.userRepo = this.dataSource.getRepository(User);
  }

  async createUser(
    data: Partial<User>,
    manager?: EntityManager,
  ): Promise<User> {
    const repo = manager?.getRepository(User) ?? this.userRepo;
    const user = repo.create(data);
    return repo.save(user);
  }

  async findOneBy<K extends Keys<User>>(
    cond: FindOptionsWhere<User> | FindOptionsWhere<User>[],
    select?: K[],
    manager?: EntityManager,
    lock?: { mode: DatabaseLockMode },
  ): Promise<User> {
    const repo = manager?.getRepository(User) ?? this.userRepo;
    const user = await repo.findOne({
      where: cond,
      ...(select && { select }),
      ...(lock && { lock }),
    });

    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    return user;
  }

  async findByEmail(email: string, manager?: EntityManager): Promise<User> {
    const repo = manager?.getRepository(User) ?? this.userRepo;
    const user = await repo.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException(`User with email "${email}" not found`);
    }

    return user;
  }

  async updateUser(
    id: string,
    data: Partial<User>,
    manager?: EntityManager,
  ): Promise<User> {
    const repo = manager?.getRepository(User) ?? this.userRepo;
    const user = await this.findOneBy({ id }, undefined, manager);

    Object.assign(user, data);
    return repo.save(user);
  }
}
