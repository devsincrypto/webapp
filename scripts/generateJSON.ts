import cliProgress from 'cli-progress';

import * as ecoQ from '../src/db/eco';
import {
	genAllEcos,
	genChartDevsByMonth,
	genEcoSlugs,
	genEcoUsers,
	genIndividualEcos,
	genReposByEcosystem,
} from './queries';

export async function main(): Promise<void> {
	console.log('Starting script to generate JSONs.');

	const slugs = ecoQ.allSlugs();
	await genEcoSlugs(slugs);

	const mb = new cliProgress.MultiBar({});
	await Promise.all([
		genAllEcos(mb),
		genChartDevsByMonth(mb),
		genIndividualEcos(slugs, mb),
		genEcoUsers(slugs, mb),
		genReposByEcosystem(slugs, mb),
	]);
}

main()
	.then(() => process.exit(0))
	.catch((err) => {
		console.error(err);
		process.exit(1);
	});
