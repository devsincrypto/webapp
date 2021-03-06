import {
	Avatar,
	Button,
	Spacer,
	Table,
	Tooltip,
	User as GeistUser,
} from '@geist-ui/react';
import { TableColumnRender } from '@geist-ui/react/dist/table/table-types';
import { ChevronDown, ChevronsDown } from '@geist-ui/react-icons';
import Link from 'next/link';
import React, { useState } from 'react';

import { Ecosystem, User } from '../db';
import { kFormatter } from '../util/format';

interface UserListProps {
	eco: Ecosystem;
	users: User[];
}

interface Row extends User {
	rank: number;
	scoreStr: string;
}

const PAGINATION = 5;

export function UserList({ eco, users }: UserListProps): React.ReactElement {
	const [limit, setLimit] = useState(PAGINATION);

	const renderUser: TableColumnRender<Row> = (githubLoginMasked, row) => (
		<GeistUser
			name={
				<>
					{githubLoginMasked}
					{'*'.repeat(8)}
					<Tooltip
						placement="right"
						text="Masked for privacy reasons"
						type="dark"
					>
						🔒
					</Tooltip>
				</>
			}
			text={githubLoginMasked as string}
		>
			Score: {row.scoreStr}
		</GeistUser>
	);

	return (
		<>
			<h2>
				Top {limit} {eco.title} developers
			</h2>

			<Table
				data={users
					.map(
						(user, index) =>
							({
								...user,
								rank: index + 1,
								scoreStr: kFormatter(user.score),
							} as Row)
					)
					.slice(0, limit)}
			>
				<Table.Column<Row> prop="rank" label="Rank" />
				<Table.Column<Row> prop="githubLoginMasked" render={renderUser}>
					Github Login
					<Tooltip
						text="How is a user's score calculated?'"
						type="dark"
					>
						<Link href="/faq#how-is-developers-score-calculated">
							<Avatar text="?" />
						</Link>
					</Tooltip>
				</Table.Column>
			</Table>

			<Spacer />
			<div className="flex justify-center">
				<Button
					disabled={limit >= users.length}
					icon={<ChevronDown />}
					onClick={() => setLimit(limit + PAGINATION)}
					scale={1 / 2}
					ghost
					type="secondary"
				>
					Load {PAGINATION} more
				</Button>
				<Spacer />
				<Button
					disabled={limit >= users.length}
					icon={<ChevronsDown />}
					onClick={() => setLimit(users.length)}
					scale={1 / 2}
					ghost
					type="secondary"
				>
					Load all {users.length}
				</Button>
			</div>
		</>
	);
}
