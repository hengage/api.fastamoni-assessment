import { Inject, Injectable, Logger } from '@nestjs/common';
import { DATA_SOURCE } from 'src/common/constants';
import { DataSource, EntityManager, QueryRunner } from 'typeorm';

@Injectable()
export class AtomicTransactionService {
  private readonly logger = new Logger(AtomicTransactionService.name);

  constructor(@Inject(DATA_SOURCE) private readonly dataSource: DataSource) {}

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
