export const Msgs = {
  // User related messages
  users: {
    EMAIL_ALREADY_EXISTS: () => 'Email already registered',

    NOT_FOUND: () => 'User not found',
    NOT_FOUND_BY_EMAIL: (email: string) =>
      `User with email '${email}' not found`,

    CREATED: () => 'User created successfully',

    UPDATED: () => 'User updated successfully',

    DELETED: () => 'User deleted successfully',
  },

  // Wallet related messages
  wallet: {
    NOT_FOUND: (id: string) => `Wallet with ID '${id}' not found`,

    INSUFFICIENT_BALANCE: () => 'Insufficient wallet balance',

    pin: {
      UPDATED: () => 'Transaction PIN updated successfully',
      INVALID: () => 'Invalid transaction PIN',
    },

    transaction: {
      SUCCESS: () => 'Transaction completed successfully',
      FAILED: () => 'Transaction failed',
    },
  },

  // Auth related messages
  auth: {
    INVALID_CREDENTIALS: () => 'Invalid email or password',

    UNAUTHORIZED: () => 'Unauthorized access',

    token: {
      INVALID: () => 'Invalid or expired token',
      REQUIRED: () => 'Authentication token is required',
    },
  },

  requestValidation: {
    FIELD_REQUIRED: (field: string) => `${field} is required`,

    INVALID_EMAIL: () => 'Please provide a valid email address',

    INVALID_TYPE: (field: string, type: string) => `${field} must be a ${type}`,

    MIN_LENGTH: (field: string, length: number) =>
      `${field} must be at least ${length} characters`,

    MAX_LENGTH: (field: string, length: number) =>
      `${field} cannot exceed ${length} characters`,

    EXACT_LENGTH: (field: string, length: number) =>
      `${field} must be exactly ${length} characters`,

    NUMERIC_ONLY: (field: string) => `${field} must contain only numbers`,
  },

  // Common messages
  common: {
    INVALID_INPUT: () => 'Invalid input provided',
    NOT_FOUND: (resource: string) => `${resource} not found`,
    SERVER_ERROR: () => 'An unexpected error occurred. Please try again later.',
    VALIDATION_ERROR: () => 'Validation failed',
    ACCESS_DENIED: () => 'You do not have permission to perform this action',
    MISSING_ENV: (key: string) => `Missing environment variable: ${key}`,
  },
};
