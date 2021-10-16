import cliProgress from 'cli-progress';
import { existsSync } from 'fs';
import fs from 'fs/promises';

import * as ecoQ from '../../src/db/eco';
import { promiseAllLimit } from '../../src/util/helpers';
import { BASE_JSON_DIR, createDir } from './shared';

/**
 * An array of all ecosystems, with some metadata per ecosystem.
 *
 * JSON file: `/ecosystem/all.json`
 */
export async function genAllEcos(): Promise<void> {
	console.log('Starting genAllEcos...');
	console.time('genAllEcos');

	const baseDir = `${BASE_JSON_DIR}/ecosystems`;
	await createDir(baseDir);

	await fs.writeFile(
		`${baseDir}/all.json`,
		JSON.stringify(ecoQ.all(), undefined, '\t')
	);
	console.timeEnd('genAllEcos');
}

export async function genIndividualEcos(
	slugs: string[],
	mb: cliProgress.MultiBar
): Promise<void> {
	console.log('Starting genIndividualEcos...');
	console.time('genIndividualEcos');

	const baseDir = `${BASE_JSON_DIR}/ecosystems/bySlug`;
	await createDir(baseDir);

	const b = mb.create(slugs.length, 0);
	await promiseAllLimit(
		2,
		slugs.map((slug) => async () => {
			b.increment();

			// Skip file if file already exists.
			if (existsSync(`${baseDir}/${slug}.json`)) {
				return;
			}

			await fs.writeFile(
				`${baseDir}/${slug}.json`,
				JSON.stringify(ecoQ.get(slug), undefined, '\t')
			);
		})
	);

	b.stop();
	console.timeEnd('genIndividualEcos');
}

export async function genEcoSlugs(slugs: string[]): Promise<void> {
	console.log('Starting genEcoSlugs...');
	console.time('genEcoSlugs');

	const baseDir = `${BASE_JSON_DIR}/ecosystems`;
	await createDir(baseDir);

	await fs.writeFile(
		`${baseDir}/slugs.json`,
		JSON.stringify(slugs, undefined, '\t')
	);
	console.timeEnd('genEcoSlugs');
}
