import React from 'react';

import { User } from '../db';
import { kFormatter } from '../util';

interface UserListProps {
	users: User[];
}

export function UserList({ users }: UserListProps): React.ReactElement {
	return (
		<>
			<h2>Top {users.length} users:</h2>
			{users.map((user, index) => (
				<div className="tile" key={user.githubLogin}>
					<div className="tile-icon">
						<div className="example-tile-icon">
							<i className="icon icon-file centered"></i>
						</div>
					</div>
					<div className="tile-content">
						<p className="tile-title">
							<h4>
								#{index + 1} {user.githubLogin}{' '}
							</h4>
							<span className="chip">
								Score: {kFormatter(user.score)}
							</span>
						</p>
						<p className="tile-subtitle">
							Earths Mightiest Heroes joined forces to take on
							threats that were too big for any one hero to
							tackle...
						</p>
					</div>
					<div className="tile-action">
						<button className="btn btn-primary">Join</button>
					</div>
				</div>
			))}
		</>
	);
}
