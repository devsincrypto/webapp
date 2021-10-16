import fs from 'fs/promises';

import * as userQ from '../../src/db/users';
import { BASE_JSON_DIR, createDir } from './shared';

export async function genChartDevsByMonth(): Promise<void> {
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
