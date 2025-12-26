export const TABLE_NAMES = {
  USERS: 'users',
};

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
