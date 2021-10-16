import cliProgress from 'cli-progress';
import fs from 'fs/promises';

import * as userQ from '../../src/db/users';
import { BASE_JSON_DIR, createDir } from './shared';

export async function genChartDevsByMonth(
	mb: cliProgress.MultiBar
): Promise<void> {
	const baseDir = `${BASE_JSON_DIR}/charts`;
	await createDir(baseDir);

	const b = mb.create(1, 0);
	await fs.writeFile(
		`${baseDir}/devsByMonth.json`,
		JSON.stringify(userQ.devsByMonth(), undefined, '\t')
	);

	b.stop();
}
