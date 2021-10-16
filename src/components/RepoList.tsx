import { Avatar, Button, Link, Spacer, Table, Tooltip } from '@geist-ui/react';
import { TableColumnRender } from '@geist-ui/react/dist/table/table-types';
import {
	ChevronDown,
	ChevronsDown,
	Eye,
	GitBranch,
	Star,
} from '@geist-ui/react-icons';
import React, { useState } from 'react';

import { Ecosystem, Repo } from '../db';
import { kFormatter } from '../util/format';

interface RepoListProps {
	eco: Ecosystem;
	repos: Repo[];
}

interface Row extends Repo {
	rank: number;
	popularityStr: string;
}

const PAGINATION = 5;

export function RepoList({ eco, repos }: RepoListProps): React.ReactElement {
	const [limit, setLimit] = useState(PAGINATION);

	const renderRepo: TableColumnRender<Row> = (repo, row) => (
		<>
			<Link
				href={`https://github.com/${repo}`}
				icon
				color
				target="_blank"
				rel="noopener noreferrer"
			>
				{repo}
			</Link>
			<small className="flex">
				<Star size={16} /> {kFormatter(row.stars)}
				<Spacer />
				<Eye size={16} /> {kFormatter(row.watchers)}
				<Spacer />
				<GitBranch size={16} /> {kFormatter(row.forks)}
			</small>
		</>
	);

	return (
		<>
			<h2>
				Top {limit} {eco.title} Github repositories
			</h2>

			<Table
				data={repos
					.map(
						(repo, index) =>
							({
								...repo,
								rank: index + 1,
								popularityStr: kFormatter(
									repo.forks + repo.watchers + repo.stars
								),
							} as Row)
					)
					.slice(0, limit)}
			>
				<Table.Column<Row> prop="rank" label="Rank" />
				<Table.Column<Row>
					prop="name"
					label="Repo"
					render={renderRepo}
				/>
				<Table.Column<Row> prop="popularityStr">
					Popularity
					<Tooltip
						text="How is a repo's Popularity calculated?'"
						type="dark"
					>
						<Link href="/faq#how-are-ecosystems-ranked">
							<Avatar text="?" />
						</Link>
					</Tooltip>
				</Table.Column>
			</Table>

			<Spacer />
			<div className="flex justify-center">
				<Button
					disabled={limit >= repos.length}
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
					disabled={limit >= repos.length}
					icon={<ChevronsDown />}
					onClick={() => setLimit(repos.length)}
					scale={1 / 2}
					ghost
					type="secondary"
				>
					Load all {repos.length}
				</Button>
			</div>
		</>
	);
}
