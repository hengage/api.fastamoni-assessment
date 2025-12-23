import { ConfigService, EnvironmentKeys } from './config.service';

// Define types for environment variable configuration
type EnvConfig = {
  type?: 'string' | 'number' | 'boolean';
  required?: boolean;
  fallback?: string | number | boolean;
};

// Define configuration for each environment variable
const envConfig: Record<EnvironmentKeys, EnvConfig> = {
  // Required strings
  [EnvironmentKeys.NODE_ENV]: {},
  [EnvironmentKeys.JWT_SECRET]: {},
  [EnvironmentKeys.DATABASE_USERNAME]: {},
  [EnvironmentKeys.DATABASE_PASSWORD]: {},
  [EnvironmentKeys.DATABASE_NAME]: {},
  [EnvironmentKeys.DATABASE_HOST]: {},

  // Numbers
  [EnvironmentKeys.PORT]: { type: 'number', fallback: 8080 },
  [EnvironmentKeys.DATABASE_PORT]: { type: 'number' },
} as const;

// Lazy loading function to avoid timing issues
function createEnv() {
  const configService = new ConfigService();

  // Strategy pattern for environment variable parsing
  const envParsers = {
    number: (envKey: EnvironmentKeys, config: EnvConfig) =>
      configService.getEnvNum(
        envKey,
        config.fallback as number,
        config.required !== false,
      ),
    boolean: (envKey: EnvironmentKeys, config: EnvConfig) =>
      configService.getEnvBool(
        envKey,
        config.fallback as boolean,
        config.required !== false,
      ),
    string: (envKey: EnvironmentKeys, config: EnvConfig) =>
      configService.getEnv({
        key: envKey,
        required: config.required !== false,
      }),
  };

  return Object.fromEntries(
    Object.entries(envConfig).map(([key, configOptions]) => {
      const envKey = key as EnvironmentKeys;
      const value = envParsers[configOptions.type || 'string'](
        envKey,
        configOptions,
      );
      return [key, value];
    }),
  ) as Record<EnvironmentKeys, string | number | boolean>;
}

// Lazy-loaded ENV object
let _env: Record<EnvironmentKeys, string | number | boolean> | null = null;

export const ENV = new Proxy(
  {} as Record<EnvironmentKeys, string | number | boolean>,
  {
    /**
     * Gets the value of the environment variable at the given key.
     * If the key is not present, it will throw an error.
     * @param {Object} target - The target object
     * @param {string} prop - The key of the environment variable
     * @returns {string|number|boolean} The value of the environment variable
     */
    get(target, prop) {
      if (!_env) {
        _env = createEnv();
      }
      return _env[prop as EnvironmentKeys];
    },
  },
);
