import { withSentry } from '@sentry/nextjs';
import { NextApiRequest, NextApiResponse } from 'next';

import { User } from '../../../../db';
import { decrypt } from '../../../../util/crypto';
import {
	getActiveSubscriptions,
	getUser,
} from '../../../../util/supabaseServer';

async function usersbyEco(
	req: NextApiRequest,
	res: NextApiResponse
): Promise<void> {
	if (req.method !== 'GET') {
		res.setHeader('Allow', 'GET');
		res.status(405).json({ error: 'Method Not Allowed' });

		return;
	}

	// This endpoint is only allowed for paying customers. Check that.
	const token = req.headers.token;
	if (typeof token !== 'string') {
		res.status(400).json({
			error: `Expected header token as string, got ${typeof token}.`,
		});

		return;
	}
	const user = await getUser(token);
	if (!user) {
		res.status(401).json({
			error: `Got empty user with token ${token}`,
		});

		return;
	}
	const subs = await getActiveSubscriptions(user);
	if (!subs || !subs.length) {
		res.status(401).json({
			error: `User ${
				user.email || user.id
			} does not have any active subscription.`,
		});

		return;
	}

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

export default withSentry(usersbyEco);
