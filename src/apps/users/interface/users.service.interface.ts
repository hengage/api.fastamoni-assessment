import { EntityManager } from 'typeorm';
import { User } from '../entities/user.entity';

export abstract class IUsersService {
  abstract createUser(
    data: Partial<User>,
    manager?: EntityManager,
  ): Promise<User>;

  abstract findByEmail(email: string, manager?: EntityManager): Promise<User>;

  abstract findById(id: string, manager?: EntityManager): Promise<User>;

  abstract updateUser(
    id: string,
    data: Partial<User>,
    manager?: EntityManager,
  ): Promise<User>;
}
