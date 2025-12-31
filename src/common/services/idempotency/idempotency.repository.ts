import { Inject, Injectable } from '@nestjs/common';
import { DATA_SOURCE } from 'src/common/constants';
import { DataSource, EntityManager } from 'typeorm';
import { IdempotencyKey } from './idempotency.entity';
import { CreateIdempotencyKey } from './idempotency.interface';

@Injectable()
export class IdempotencyRepository {
  constructor(@Inject(DATA_SOURCE) private dataSource: DataSource) {}

  async create(
    data: CreateIdempotencyKey,
    manager?: EntityManager,
  ): Promise<void> {
    const repo =
      manager?.getRepository(IdempotencyKey) ??
      this.dataSource.getRepository(IdempotencyKey);
    const entity = repo.create(data);
    await repo.save(entity);
  }

  async cleanupExpired(): Promise<void> {
    await this.dataSource
      .getRepository(IdempotencyKey)
      .createQueryBuilder()
      .delete()
      .where('expiresAt < :now', { now: new Date() })
      .execute();
  }

  async findOneByKey(
    key: string,
    manager?: EntityManager,
  ): Promise<IdempotencyKey | null> {
    const repo =
      manager?.getRepository(IdempotencyKey) ??
      this.dataSource.getRepository(IdempotencyKey);
    return repo.findOne({ where: { key } });
  }
}
