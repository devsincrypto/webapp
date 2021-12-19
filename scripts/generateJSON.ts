import cliProgress from 'cli-progress';
import * as fs from 'fs/promises';

import * as ecoQ from '../src/db/eco';
import {
	genAllEcos,
	genChartDevsByMonth,
	genEcoSlugs,
	genEcoUsers,
	genIndividualEcos,
	genReposByEcosystem,
} from './queries';
import { BASE_JSON_DIR } from './queries/shared';

export async function main(): Promise<void> {
	console.log('Starting script to generate JSONs.');

	const slugs = ecoQ.allSlugs();
	await genEcoSlugs(slugs);

	const mb = new cliProgress.MultiBar({
		format: '[{bar}] | {percentage}% | ETA: {eta}s | {filename}',
	});
	await Promise.all([
		genAllEcos(mb),
		genChartDevsByMonth(mb),
		genIndividualEcos(slugs, mb),
		genEcoUsers(slugs, mb),
		genReposByEcosystem(slugs, mb),
		lastUpdated(),
	]);
}

async function lastUpdated() {
	await fs.writeFile(
		`${BASE_JSON_DIR}/lastUpdated.json`,
		JSON.stringify(new Date().toUTCString())
	);
}

main()
	.then(() => process.exit(0))
	.catch((err) => {
		console.error(err);
		process.exit(1);
	});
