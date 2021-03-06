import cliProgress from 'cli-progress';
import fs from 'fs/promises';

import * as repoQ from '../../src/db/repos';
import { promiseAllLimit } from '../../src/util/helpers';
import { BASE_JSON_DIR, createDir } from './shared';

export async function genReposByEcosystem(
	slugs: string[],
	mb: cliProgress.MultiBar
): Promise<void> {
	const baseDir = `${BASE_JSON_DIR}/repos/byEco`;
	await createDir(baseDir);

	const b = mb.create(slugs.length, 0);
	await promiseAllLimit(
		2,
		slugs.map((slug) => async () => {
			const filename = `${baseDir}/${slug}.json`;
			b.increment(1, { filename });

			await fs.writeFile(
				filename,
				JSON.stringify(repoQ.byEcosystem(slug), undefined, '\t')
			);
		})
	);

	b.stop();
}
