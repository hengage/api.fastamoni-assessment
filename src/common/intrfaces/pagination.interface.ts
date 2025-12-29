export interface CursorPaginationMeta {
  primaryCursor?: string;
  secondaryCursor?: string;
  hasMore: boolean;
}

export type CursorPaginationResult<T, K extends string> = {
  [P in K]: T[];
} & { pagination: CursorPaginationMeta };
