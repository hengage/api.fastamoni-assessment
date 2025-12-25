import { Injectable, ConflictException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { IUsersService } from './interface/users.service.interface';
import { EntityManager } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/user.dto';

@Injectable()
export class UsersService extends IUsersService {
  constructor(private readonly usersRepo: UsersRepository) {
    super();
  }

  private async ensureEmailNotExists(email: string, manager?: EntityManager) {
    const existingUser = await this.usersRepo
      .findOneBy({ email }, ['email'], manager)
      .catch(() => null);
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }
  }

  async createUser(
    data: CreateUserDto,
    manager?: EntityManager,
  ): Promise<User> {
    await this.ensureEmailNotExists(data.email, manager);

    return this.usersRepo.createUser(data, manager);
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
