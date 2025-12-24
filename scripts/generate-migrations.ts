/**
 * Script: generate-migration.ts
 * ---------------------------------------
 * Automates the creation of a new TypeORM migration in the root `migrations` folder.
 *
 * Usage:
 *   pnpm migration <MigrationName>
 * Example:
 *   pnpm migration create-users-table
 *
 * This will generate a migration file like:
 *   migrations/1671234567890-create-users-table.ts
 */

import { execSync } from 'child_process';

const migrationName = process.argv[2];
if (!migrationName) {
  console.error('Please provide a migration name.');
  process.exit(1);
}

console.log(`Generating migration: ${migrationName}...`);

execSync(
  `pnpm typeorm migration:generate ./migrations/${migrationName} -d ./src/database/data-source.ts`,
  { stdio: 'inherit' },
);

console.log('Migration generated successfully!');
