import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

/** Load `server/.env` regardless of current working directory (repo root or `server/`). */
export function loadEnv(): void {
  const serverRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  dotenv.config({ path: path.join(serverRoot, '.env') });
}
