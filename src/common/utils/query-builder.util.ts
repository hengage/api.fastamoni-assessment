import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';

export class QueryBuilderUtil {
  static applyDateRangeFilter<T extends ObjectLiteral>(
    qb: SelectQueryBuilder<T>,
    alias: string,
    startDate?: string,
    endDate?: string,
    field = 'createdAt',
  ) {
    if (startDate) {
      qb.andWhere(`${alias}.${field} >= :startDate`, { startDate });
    }

    if (endDate) {
      const endOfDay = new Date(endDate);
      endOfDay.setHours(23, 59, 59, 999);
      qb.andWhere(`${alias}.${field} <= :endDate`, { endDate: endOfDay });
    }
  }

  static applyRangeFilter<T extends ObjectLiteral>(
    qb: SelectQueryBuilder<T>,
    alias: string,
    minValue?: number,
    maxValue?: number,
    field = 'amount',
  ) {
    if (minValue !== undefined) {
      qb.andWhere(`${alias}.${field} >= :minValue`, { minValue });
    }

    if (maxValue !== undefined) {
      qb.andWhere(`${alias}.${field} <= :maxValue`, { maxValue });
    }
  }

  static applyGenericFilters<T extends ObjectLiteral>(
    qb: SelectQueryBuilder<T>,
    alias: string,
    query: Record<string, string | number | undefined>,
    specialKeys: string[] = QueryBuilderUtil.defaultSpecialKeys,
  ) {
    Object.entries(query).forEach(([key, value]) => {
      if (value === undefined || value === null) return;
      if (specialKeys.includes(key)) return;

      qb.andWhere(`${alias}.${key} = :${key}`, { [key]: value });
    });
  }

  static applyAllFilters<T extends ObjectLiteral>(
    qb: SelectQueryBuilder<T>,
    alias: string,
    query: Record<string, string | number | undefined>,
    specialKeys: string[],
    dateField = 'createdAt',
    amountField = 'amount',
  ) {
    const mergedKeys = [...QueryBuilderUtil.defaultSpecialKeys, ...specialKeys];
    this.applyGenericFilters(qb, alias, query, mergedKeys);
    this.applyDateRangeFilter(
      qb,
      alias,
      query.startDate as string | undefined,
      query.endDate as string | undefined,
      dateField,
    );
    this.applyRangeFilter(
      qb,
      alias,
      query.minAmount as number | undefined,
      query.maxAmount as number | undefined,
      amountField,
    );
  }

  /**
   * It serves as a built-in list of keys used for special filtering operations (like date ranges or pagination),
   * ensuring these parameters are not mistakenly treated as direct database field filters.
   *
   * @private
   */
  static defaultSpecialKeys = [
    'startDate',
    'endDate',
    'minAmount',
    'maxAmount',
    'sortDirection',
    'limit',
  ];
}
