import { existsSync } from 'fs';
import fs from 'fs/promises';

export const BASE_JSON_DIR = './src/db/json';

/**
 * Create a directory if it does not exist.
 *
 * @param dir - The dir to create.
 */
export async function createDir(dir: string): Promise<void> {
	if (!existsSync(dir)) {
		await fs.mkdir(dir, { recursive: true });
	}
}
