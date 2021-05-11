import type { NextApiRequest, NextApiResponse } from 'next';

import { userQ } from '../../../db';

export default function avatar(
	req: NextApiRequest,
	res: NextApiResponse
): void {
	const { id } = req.query;

	const githubLogin = userQ.githubLoginById(+id);
	res.end(`https://avatars.githubusercontent.com/${githubLogin}`);
}
