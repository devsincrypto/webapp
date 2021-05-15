import { NextApiRequest, NextApiResponse } from 'next';

import { User } from '../../../../db';
import { decrypt } from '../../../../util/crypto';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
): Promise<void> {
	const { eco } = req.query as { eco: string };

	const encryptedUsers = ((await import(
		`../../../../db/json/users/byEco/${eco}.json`
	)) as {
		default: User[];
	}).default;

	const users = encryptedUsers.map((user) => ({
		...user,
		githubLogin: decrypt(user.githubLoginEncrypted),
	}));

	return res.json(users);
}
