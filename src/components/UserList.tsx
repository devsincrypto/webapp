import { AxiosError } from 'axios';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

import { Ecosystem, User } from '../db';
import { kFormatter } from '../util/format';
import { getData } from '../util/helpers';
import { useUser } from '../util/useUser';

interface UserListProps {
	eco: Ecosystem;
	users: User[];
}

function linkToGithub(name: string): string {
	return `https://github.com/${name}`;
}

export function UserList({
	eco,
	users: encryptedUsers,
}: UserListProps): React.ReactElement {
	const [limit, setLimit] = useState(20);
	const [users, setUsers] = useState(encryptedUsers);
	const [error, setError] = useState<
		AxiosError<{ error: string }> | undefined
	>(undefined);
	const { session, subscription, user } = useUser();

	const isSignedUp = !!user;
	const isPaying = !!subscription;

	useEffect(() => {
		if (!isPaying) {
			return;
		}

		getData<User[]>({
			token: session?.access_token,
			url: `/api/users/byEco/${eco.slug}`,
		})
			.then(setUsers)
			.catch((err: AxiosError<{ error: string }>) => {
				console.log(err);
				setError(err);
			});
	}, [eco, isPaying, session, user]);

	return (
		<section className="section">
			<h2>
				Top {limit} {eco.title} developers
			</h2>
			{error && (
				<div className="toast toast-error">
					<button
						className="btn btn-clear float-right"
						onClick={() => setError(undefined)}
					></button>
					{error.response?.data?.error || error.message}
				</div>
			)}
			<table className="table table-striped">
				<thead>
					<tr>
						<th>Rank</th>
						<th>
							Github Login
							{!isPaying && (
								<span>
									{' '}
									(
									{isSignedUp ? (
										<Link href="/account">
											<button className="btn btn-sm">
												Subscribe
											</button>
										</Link>
									) : (
										<Link href="/signin">
											<button className="btn btn-sm">
												Sign up
											</button>
										</Link>
									)}
									to reveal full profile)
								</span>
							)}
						</th>
						<th>
							Score{' '}
							<Link href="/faq#how-is-developers-score-calculated">
								<figure
									className="avatar avatar-sm c-hand tooltip tooltip-right"
									data-initial="?"
									data-tooltip="How is a user's score calculated?"
								></figure>
							</Link>
						</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					{users.slice(0, limit).map((user, i) => (
						<tr key={user.githubLoginEncrypted}>
							<td>#{i + 1}</td>
							<td>
								{user.githubLogin ? (
									<a
										className="chip"
										href={linkToGithub(user.githubLogin)}
										target="_blank"
										rel="noopener noreferrer"
									>
										<figure
											className="avatar avatar-sm"
											data-initial={
												user.githubLoginMasked
											}
										></figure>
										{user.githubLogin}
									</a>
								) : (
									<div
										className="d-inline tooltip tooltip-right"
										data-tooltip={`${
											isSignedUp ? 'Subscribe' : 'Sign up'
										} to reveal full profile`}
									>
										<div className="chip">
											<figure
												className="avatar avatar-sm"
												data-initial={
													user.githubLoginMasked
												}
											></figure>
											{user.githubLoginMasked}
											{'*'.repeat(8)}
											🔒
										</div>
									</div>
								)}
							</td>
							<td>
								<code>{kFormatter(user.score)}</code>
							</td>
							<td></td>
						</tr>
					))}
				</tbody>
			</table>
			<button
				className="btn btn-sm"
				disabled={limit >= users.length}
				onClick={() => setLimit(limit + 20)}
			>
				Load more
			</button>
			<button
				className="btn btn-sm"
				disabled={limit >= users.length}
				onClick={() => setLimit(users.length)}
			>
				Load all
			</button>
		</section>
	);
}
