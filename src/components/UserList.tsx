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
				Top {limit} {eco.title} developers
			</h2>
			<table className="table table-striped">
				<thead>
					<tr>
						<th>Rank</th>
						<th>Github Login</th>
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
								<div
									className="d-inline tooltip tooltip-right"
									data-tooltip="Masked for privacy reasons"
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
