import { Injectable, Logger } from '@nestjs/common';
import { DataSource, EntityManager, QueryRunner } from 'typeorm';

@Injectable()
export class AtomicTransactionService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly logger: Logger,
  ) {}

  private createRunner(): QueryRunner {
    return this.dataSource.createQueryRunner();
  }

  async runInAtomic<T>(
    executeFunc: (manager: EntityManager) => Promise<T>,
  ): Promise<T> {
    const queryRunner = this.createRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const result = await executeFunc(queryRunner.manager);
      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();

      this.logger.error(`Database transaction failed: ${error}`);

      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
