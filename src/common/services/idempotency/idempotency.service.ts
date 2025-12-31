import { Injectable } from '@nestjs/common';
import { IdempotencyRepository } from './idempotency.repository';
import { EntityManager } from 'typeorm';
import { CreateIdempotencyKey } from './idempotency.interface';
import { DATABASE_LOCK_MODES } from 'src/common/constants';

@Injectable()
export class IdempotencyService {
  constructor(private idempotencyRepo: IdempotencyRepository) {}

  async execute<T>(
    data: Omit<CreateIdempotencyKey, 'response'>,
    operation: (manager: EntityManager) => Promise<T>,
    manager: EntityManager,
  ): Promise<T> {
    // Check existing
    const existing = await this.idempotencyRepo.findOneByKey(
      data.key,
      manager,
      { mode: DATABASE_LOCK_MODES.PESSIMISTIC_WRITE },
    );
    if (existing) {
      return existing.response as T;
    }

    // Execute operation
    const result = await operation(manager);

    await this.idempotencyRepo.create(
      { ...data, response: result as unknown as JSONValue },
      manager,
    );

    return result;
  }
}
