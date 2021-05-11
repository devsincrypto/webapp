import React, { useState } from 'react';

import { User } from '../db';
import { kFormatter } from '../util/format';

interface UserListProps {
	users: User[];
}

export function UserList({ users }: UserListProps): React.ReactElement {
	const [limit, setLimit] = useState(20);

	return (
		<>
			<h2>Top {users.length} users:</h2>
			<table className="table">
				<thead>
					<tr>
						<th>Rank</th>
						<th>Github Login</th>
						<th>Score</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					{users.slice(0, limit).map((user, i) => (
						<tr key={user.githubLogin}>
							<td>#{i + 1}</td>
							<td>{user.githubLogin}</td>
							<td>{kFormatter(user.score)}</td>
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
		</>
	);
}
