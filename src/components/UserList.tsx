import Link from 'next/link';
import React, { useState } from 'react';

import { Ecosystem, User } from '../db';
import { kFormatter } from '../util/format';

interface UserListProps {
	eco: Ecosystem;
	users: User[];
}

export function UserList({ eco, users }: UserListProps): React.ReactElement {
	const [limit, setLimit] = useState(20);

	return (
		<section className="section">
			<h2>
				Top {limit} {eco.title} users
			</h2>
			<table className="table table-striped">
				<thead>
					<tr>
						<th>Rank</th>
						<th>
							Github Login (
							<Link href="/signin">
								<button className="btn btn-sm">Sign in</button>
							</Link>
							to reveal)
						</th>
						<th>Score</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					{users.slice(0, limit).map((user, i) => (
						<tr key={user.githubLoginEncrypted}>
							<td>#{i + 1}</td>
							<td>
								<div className="chip">
									<figure
										className="avatar avatar-sm"
										data-initial={user.githubLoginMasked}
									></figure>
									{user.githubLoginMasked}
									{'*'.repeat(8)}
								</div>
							</td>
							<td>
								<code>{kFormatter(user.score)}</code>
							</td>
							<td>See Profile</td>
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
