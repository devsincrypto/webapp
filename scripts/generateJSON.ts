import cliProgress from 'cli-progress';
import { existsSync } from 'fs';
import fs from 'fs/promises';

import * as ecoQ from '../src/db/eco';
import * as userQ from '../src/db/users';
import { promiseAllLimit } from '../src/util/helpers';

const BASE_JSON_DIR = './src/db/json';

async function genAllEcos() {
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

async function genIndividualEcos(slugs: string[], mb: cliProgress.MultiBar) {
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

async function genEcoUsers(slugs: string[], mb: cliProgress.MultiBar) {
	console.log('Starting genEcoUsers...');
	console.time('genEcoUsers');

	const baseDir = `${BASE_JSON_DIR}/users/byEco`;
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
				JSON.stringify(userQ.usersByEco(slug), undefined, '\t')
			);
		})
	);

	b.stop();
	console.timeEnd('genEcoUsers');
}

async function genEcoSlugs(slugs: string[]) {
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

async function genChartDevsByMonth() {
	console.log('Starting genChartDevsByMonth...');
	console.time('genChartDevsByMonth');

	const baseDir = `${BASE_JSON_DIR}/charts`;
	await createDir(baseDir);

	await fs.writeFile(
		`${baseDir}/devsByMonth.json`,
		JSON.stringify(userQ.devsByMonth(), undefined, '\t')
	);
	console.timeEnd('genChartDevsByMonth');
}

export async function main(): Promise<void> {
	console.log('Starting script to generate JSONs.');

	const slugs = ecoQ.allSlugs();
	await Promise.all([
		genAllEcos(),
		genEcoSlugs(slugs),
		genChartDevsByMonth(),
	]);

	const mb = new cliProgress.MultiBar({});
	await Promise.all([genIndividualEcos(slugs, mb), genEcoUsers(slugs, mb)]);
}

main()
	.then(() => process.exit(0))
	.catch((err) => {
		console.error(err);
		process.exit(1);
	});

/**
 * Create a directory if it does not exist.
 *
 * @param dir - The dir to create.
 */
async function createDir(dir: string): Promise<void> {
	if (!existsSync(dir)) {
		await fs.mkdir(dir, { recursive: true });
	}
}
