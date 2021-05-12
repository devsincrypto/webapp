import cliProgress from 'cli-progress';
import { existsSync } from 'fs';
import fs from 'fs/promises';

import * as ecoQ from '../src/db/eco';
import * as userQ from '../src/db/users';

async function genAllEcos() {
	await fs.writeFile(
		'./src/db/json/ecosystems/all.json',
		JSON.stringify(ecoQ.all(), undefined, '\t')
	);
}

async function genIndividualEcos(slugs: string[], mb: cliProgress.MultiBar) {
	const b = mb.create(slugs.length, 0);
	await promiseAllLimit(
		20,
		slugs.map((slug) => async () => {
			// Skip file if file already exists.
			if (existsSync(`./src/db/json/ecosystems/bySlug/${slug}.json`)) {
				b.increment();
				return;
			}

			await fs.writeFile(
				`./src/db/json/ecosystems/bySlug/${slug}.json`,
				JSON.stringify(ecoQ.get(slug), undefined, '\t')
			);
			b.increment();
		})
	);

	b.stop();
}

async function genEcoUsers(slugs: string[], mb: cliProgress.MultiBar) {
	const b = mb.create(slugs.length, 0);
	await promiseAllLimit(
		20,
		slugs.map((slug) => async () => {
			// Skip file if file already exists.
			if (existsSync(`./src/db/json/users/byEco/${slug}.json`)) {
				b.increment();
				return;
			}

			await fs.writeFile(
				`./src/db/json/users/byEco/${slug}.json`,
				JSON.stringify(userQ.usersByEco(slug), undefined, '\t')
			);
			b.increment();
		})
	);

	b.stop();
}

async function genEcoSlugs(slugs: string[]) {
	await fs.writeFile(
		'./src/db/json/ecosystems/slugs.json',
		JSON.stringify(slugs, undefined, '\t')
	);
}

export async function main(): Promise<void> {
	console.log('Starting script to generate JSONs.');
	const mb = new cliProgress.MultiBar({});

	const slugs = ecoQ.allSlugs();
	await Promise.all([
		genAllEcos(),
		genEcoSlugs(slugs),
		genIndividualEcos(slugs, mb),
		genEcoUsers(slugs, mb),
	]);
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
