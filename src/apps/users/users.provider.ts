// users.providers.ts
import { createRepositoryProvider } from 'src/database/repository.provider';
import { User } from './entities/user.entity';
import { REPOSITORY_TOKENS } from 'src/common/constants';

export const usersProviders = [
  createRepositoryProvider(REPOSITORY_TOKENS.USER, User),
];
