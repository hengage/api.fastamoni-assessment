export enum EnvironmentKeys {
  NODE_ENV = 'NODE_ENV',
  JWT_SECRET = 'JWT_SECRET',
  PORT = 'PORT',
  DATABASE_USERNAME = 'DATABASE_USERNAME',
  DATABASE_PASSWORD = 'DATABASE_PASSWORD',
  DATABASE_NAME = 'DATABASE_NAME',
  DATABASE_HOST = 'DATABASE_HOST',
  DATABASE_PORT = 'DATABASE_PORT',
}

export class ConfigService {
  getEnv<T = string>({
    key,
    fallback,
    required = true,
    parseV = (v) => v as T,
  }: {
    key: EnvironmentKeys;
    fallback?: T;
    required?: boolean;
    parseV?: (v?: string) => T;
  }): T {
    const value = process.env[key];

    if (!value && required) {
      throw new Error(`Missing environment variable: ${key}`);
    }

    return value ? parseV(value) : (fallback as T);
  }

  getEnvBool(key: EnvironmentKeys, fallback = false, required = true) {
    return this.getEnv({
      key,
      fallback,
      parseV: (v) => v === 'true',
      required,
    });
  }

  getEnvNum(key: EnvironmentKeys, fallback?: number, required = true) {
    return this.getEnv({
      key,
      fallback,
      parseV: (v) => Number(v),
      required,
    });
  }

  setEnv(values: Partial<Record<EnvironmentKeys, string>>) {
    for (const [key, value] of Object.entries(values)) {
      if (value == null) {
        delete process.env[key];
      } else {
        process.env[key] = value;
      }
    }
  }
}
