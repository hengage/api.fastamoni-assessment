export const TABLE_NAMES = {
  USERS: 'users',
  WALLET: 'wallets',
  DONATIONS: 'donations',
} as const;

export const DATA_SOURCE = 'DATA_SOURCE';

export const REPOSITORY_TOKENS = {
  USER: 'USER_REPOSITORY',
} as const;

export const AUTH_STRATEGIES = {
  LOCAL: 'local',
  JWT: 'jwt',
} as const;

export const DATA_OPERATIONS = {
  READ: 'read',
  WRITE: 'write',
} as const;

export const DATABASE_LOCK_MODES = {
  PESSIMISTIC_WRITE: 'pessimistic_write',
  PESSIMISTIC_READ: 'pessimistic_read',
} as const;

export const DONATION_FILTER_TYPES = {
  SENT: 'sent',
  RECEIVED: 'received',
} as const;

export const SORT_DIRECTIONS = {
  ASC: 'ASC',
  DESC: 'DESC',
} as const;

export const DEFAULT_PAGINATION = {
  page: 1,
  limit: 20,
  sortDirection: SORT_DIRECTIONS.DESC,
} as const;

export const MAX_PAGINATION_LIMIT = 100;
