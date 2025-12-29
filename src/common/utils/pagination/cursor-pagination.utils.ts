import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';
import { DEFAULT_PAGINATION, SORT_DIRECTIONS } from '../../constants';
import { CursorPaginationMeta } from '../../interfaces/pagination.interface';

export interface CursorPaginationOptions {
  primaryCursor?: string;
  secondaryCursor?: string;
  limit?: number;
  sortDirection?: SortDirection;
}

export class CursorPaginationUtil {
  static async applyPagination<T extends ObjectLiteral>(
    queryBuilder: SelectQueryBuilder<T>,
    options: CursorPaginationOptions,
  ): Promise<{ data: T[]; hasMore: boolean }> {
    const {
      primaryCursor,
      secondaryCursor,
      sortDirection = SORT_DIRECTIONS.DESC,
      limit = DEFAULT_PAGINATION.limit,
    } = options;

    // Apply cursor conditions
    if (primaryCursor && secondaryCursor) {
      const cursorDate = new Date(primaryCursor);

      if (sortDirection === SORT_DIRECTIONS.DESC) {
        queryBuilder.andWhere(
          `(${queryBuilder.alias}.createdAt < :cursorDate OR (${queryBuilder.alias}.createdAt = :cursorDate AND ${queryBuilder.alias}.id > :secondaryCursor))`,
          { cursorDate, secondaryCursor },
        );
      } else {
        queryBuilder.andWhere(
          `(${queryBuilder.alias}.createdAt > :cursorDate OR (${queryBuilder.alias}.createdAt = :cursorDate AND ${queryBuilder.alias}.id < :secondaryCursor))`,
          { cursorDate, secondaryCursor },
        );
      }
    }

    console.log({ limit });
    // Apply ordering and limit
    queryBuilder
      .orderBy(`${queryBuilder.alias}.createdAt`, sortDirection)
      .addOrderBy(`${queryBuilder.alias}.id`, sortDirection)
      .limit(limit + 1);

    const data = await queryBuilder.getMany();
    const hasMore = data.length > limit;

    if (hasMore) {
      data.pop(); // Remove extra item
    }

    return { data, hasMore };
  }

  static createPaginationResult<T extends ObjectLiteral>(
    data: T[],
    hasMore: boolean,
    limit?: number,
  ): CursorPaginationMeta {
    const pagination: CursorPaginationMeta = {
      primaryCursor: hasMore
        ? data[data.length - 1].createdAt.toISOString()
        : undefined,
      secondaryCursor: hasMore ? data[data.length - 1].id : undefined,
      limit,
      hasMore,
    };

    return pagination;
  }
}
