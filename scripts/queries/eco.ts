import cliProgress from 'cli-progress';
import fs from 'fs/promises';

import * as ecoQ from '../../src/db/eco';
import { promiseAllLimit } from '../../src/util/helpers';
import { BASE_JSON_DIR, createDir } from './shared';

/**
 * An array of all ecosystems, with some metadata per ecosystem.
 *
 * JSON file: `/ecosystem/all.json`
 */
export async function genAllEcos(mb: cliProgress.MultiBar): Promise<void> {
	const baseDir = `${BASE_JSON_DIR}/ecosystems`;
	await createDir(baseDir);
	const filename = `${baseDir}/all.json`;

	const b = mb.create(20, 0, { filename });
	const timer = setInterval(() => b.increment(), 1000);

	await fs.writeFile(filename, JSON.stringify(ecoQ.all(), undefined, '\t'));

	b.update(20);
	clearInterval(timer);
	b.stop();
}

export async function genIndividualEcos(
	slugs: string[],
	mb: cliProgress.MultiBar
): Promise<void> {
	const baseDir = `${BASE_JSON_DIR}/ecosystems/bySlug`;
	await createDir(baseDir);

	const b = mb.create(slugs.length, 0);
	await promiseAllLimit(
		2,
		slugs.map((slug) => async () => {
			const filename = `${baseDir}/${slug}.json`;
			b.increment(1, { filename });

			await fs.writeFile(
				filename,
				JSON.stringify(ecoQ.get(slug), undefined, '\t')
			);
		})
	);

	b.stop();
}

export async function genEcoSlugs(slugs: string[]): Promise<void> {
	const baseDir = `${BASE_JSON_DIR}/ecosystems`;
	await createDir(baseDir);
	const filename = `${baseDir}/slugs.json`;

	await fs.writeFile(filename, JSON.stringify(slugs, undefined, '\t'));
}
