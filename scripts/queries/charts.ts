import cliProgress from 'cli-progress';
import fs from 'fs/promises';

import * as userQ from '../../src/db/users';
import { BASE_JSON_DIR, createDir } from './shared';

export async function genChartDevsByMonth(
	mb: cliProgress.MultiBar
): Promise<void> {
	const baseDir = `${BASE_JSON_DIR}/charts`;
	await createDir(baseDir);
	const filename = `${baseDir}/devsByMonth.json`;

	const b = mb.create(20, 0, { filename });
	const timer = setInterval(() => b.increment(), 1000);

	await fs.writeFile(
		filename,
		JSON.stringify(userQ.devsByMonth(), undefined, '\t')
	);

	b.update(20);
	clearInterval(timer);
	b.stop();
}
