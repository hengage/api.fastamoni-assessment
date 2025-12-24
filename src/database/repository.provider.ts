import { DATA_SOURCE, REPOSITORY_TOKENS } from 'src/common/constants';
import { DataSource, ObjectType } from 'typeorm';

/**
 * Factory helper to create a NestJS provider for a TypeORM repository.
 *
 * @template T - The entity class type (constructor) extending ObjectType<T>.
 * @param token - The injection token used to identify the repository provider.
 * @param entity - The entity class (e.g. User, Photo) for which the repository should be created.
 * @returns A provider object that registers the repository with Nest's DI container.
 *
 * @example
 * // Register a User repository provider
 * const userRepoProvider = createRepositoryProvider(
 *   REPOSITORY_TOKENS.USER,
 *   User,
 * );
 *
 * @see https://docs.nestjs.com/recipes/sql-typeorm#repository-pattern
 */
export const createRepositoryProvider = <T extends ObjectType<T>>(
  token: (typeof REPOSITORY_TOKENS)[keyof typeof REPOSITORY_TOKENS],
  entity: T,
) => ({
  provide: token,
  useFactory: (dataSource: DataSource) => dataSource.getRepository<T>(entity),
  inject: [DATA_SOURCE],
});
