/**
 * This script automates the creation of a new NestJS resource inside the `apps` folder.
 *
 * Reference:
 *   Official NestJS CRUD Generator docs → https://docs.nestjs.com/recipes/crud-generator
 *
 * Workflow:
 * 1. Reads the resource name from the command-line arguments.
 * 2. Builds the expected path for the resource (`src/apps/<resourceName>`).
 * 3. Checks if the resource directory already exists:
 *    - If yes → exits with an error to avoid overwriting.
 *    - If no → runs the Nest CLI command to generate the resource.
 *
 * Usage:
 *   pnpm resource <resourceName>
 * Example:
 *   pnpm resource users
 *
 * This will scaffold a new NestJS resource under `apps/users` without generating spec files.
 *
 * Note:
 *   This script was also added to `package.json` scripts for easier invocation,
 *   so it can be exexcuted directly with `pnpm resource <resourceName>`, instead of typing the full ts-node command.
 */

import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';

console.log('Generating new resource...');
const resourceName = process.argv[2];
if (!resourceName) {
  console.error('Please provide a resource name.');
  process.exit(1);
}

const resourcePath = join(__dirname, '..', 'src', 'apps', resourceName);

if (existsSync(resourcePath)) {
  console.error('Resource already exists.');
  process.exit(1);
}

execSync(`nest g resource apps/${resourceName} --no-spec`, {
  stdio: 'inherit',
});
