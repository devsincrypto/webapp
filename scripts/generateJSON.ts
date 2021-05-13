import cliProgress from 'cli-progress';
import { existsSync } from 'fs';
import fs from 'fs/promises';

import * as ecoQ from '../src/db/eco';
import * as userQ from '../src/db/users';

async function genAllEcos() {
	console.log('Starting genAllEcos...');
	await fs.writeFile(
		'./src/db/json/ecosystems/all.json',
		JSON.stringify(ecoQ.all(), undefined, '\t')
	);
	console.log('Finished genAllEcos.');
}

async function genIndividualEcos(slugs: string[], mb: cliProgress.MultiBar) {
	console.log('Starting genIndividualEcos...');
	const b = mb.create(slugs.length, 0);
	await promiseAllLimit(
		2,
		slugs.map((slug) => async () => {
			b.increment();

			// Skip file if file already exists.
			if (existsSync(`./src/db/json/ecosystems/bySlug/${slug}.json`)) {
				return;
			}

			await fs.writeFile(
				`./src/db/json/ecosystems/bySlug/${slug}.json`,
				JSON.stringify(ecoQ.get(slug), undefined, '\t')
			);
		})
	);

	b.stop();
	console.log('Finished genIndividualEcos.');
}

async function genEcoUsers(slugs: string[], mb: cliProgress.MultiBar) {
	console.log('Starting genEcoUsers...');
	const b = mb.create(slugs.length, 0);
	await promiseAllLimit(
		2,
		slugs.map((slug) => async () => {
			b.increment();

			// Skip file if file already exists.
			if (existsSync(`./src/db/json/users/byEco/${slug}.json`)) {
				return;
			}

			await fs.writeFile(
				`./src/db/json/users/byEco/${slug}.json`,
				JSON.stringify(userQ.usersByEco(slug), undefined, '\t')
			);
		})
	);

	b.stop();
	console.log('Finished genEcoUsers.');
}

async function genEcoSlugs(slugs: string[]) {
	console.log('Starting genEcoSlugs...');
	await fs.writeFile(
		'./src/db/json/ecosystems/slugs.json',
		JSON.stringify(slugs, undefined, '\t')
	);
	console.log('Finished genEcoSlugs.');
}

export async function main(): Promise<void> {
	console.log('Starting script to generate JSONs.');

	const slugs = ecoQ.allSlugs();
	await Promise.all([genAllEcos(), genEcoSlugs(slugs)]);

	const mb = new cliProgress.MultiBar({});
	await Promise.all([genIndividualEcos(slugs, mb), genEcoUsers(slugs, mb)]);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});

/**
 * Like Promise.all, but with max concurrency.
 *
 * @see https://gist.github.com/jcouyang/632709f30e12a7879a73e9e132c0d56b#gistcomment-3253738
 */
async function promiseAllLimit<T>(n: number, list: (() => Promise<T>)[]) {
	const head = list.slice(0, n);
	const tail = list.slice(n);
	const result: T[] = [];
	const execute = async (
		promise: () => Promise<T>,
		i: number,
		runNext: () => Promise<void>
	) => {
		result[i] = await promise();
		await runNext();
	};
	const runNext = async () => {
		const i = list.length - tail.length;
		const promise = tail.shift();
		if (promise !== undefined) {
			await execute(promise, i, runNext);
		}
	};
	await Promise.all(head.map((promise, i) => execute(promise, i, runNext)));

	return result;
}
