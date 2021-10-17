import cliProgress from 'cli-progress';
import fs from 'fs/promises';

import * as userQ from '../../src/db/users';
import { promiseAllLimit } from '../../src/util/helpers';
import { BASE_JSON_DIR, createDir } from './shared';

export async function genEcoUsers(
	slugs: string[],
	mb: cliProgress.MultiBar
): Promise<void> {
	const baseDir = `${BASE_JSON_DIR}/users/byEco`;
	await createDir(baseDir);

	const b = mb.create(slugs.length, 0, { baseDir });
	await promiseAllLimit(
		2,
		slugs.map((slug) => async () => {
			b.increment();

			await fs.writeFile(
				`${baseDir}/${slug}.json`,
				JSON.stringify(userQ.usersByEco(slug), undefined, '\t')
			);
		})
	);

	b.stop();
}
