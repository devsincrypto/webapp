import { Avatar, Button, Input, Spacer, Table, Tooltip } from '@geist-ui/react';
import { TableColumnRender } from '@geist-ui/react/dist/table/table-types';
import {
	ChevronDown,
	ChevronRight,
	ChevronsDown,
	Search,
} from '@geist-ui/react-icons';
import Link from 'next/link';
import React, { useState } from 'react';

import { Ecosystem } from '../db';
import { kFormatter } from '../util/format';

interface EcosystemListProps {
	ecos: Ecosystem[];
}

interface Row extends Ecosystem {
	rank: number;
	popularityStr: string;
	userCountStr: string;
}

const PAGINATION = 5;

export function EcosystemList({
	ecos,
}: EcosystemListProps): React.ReactElement {
	const [limit, setLimit] = useState(PAGINATION);
	const [search, setSearch] = useState('');

	const renderCtaColumn: TableColumnRender<Row> = (slug, r) => {
		return (
			<Link href={`/ecosystem/${slug as string}`}>
				<Button ghost icon={<ChevronRight />} iconRight type="success">
					See {r.userCountStr} developers
				</Button>
			</Link>
		);
	};

	return (
		<>
			<div className="flex align-center justify-between">
				<h2>
					{search
						? `Ecosystems matching "${search}"`
						: `Top ${limit} Ecosystems`}
				</h2>
				<div>
					<Input
						icon={<Search />}
						onChange={(e) => setSearch(e.currentTarget.value)}
						placeholder="Search ecosystem"
						value={search}
					/>
				</div>
			</div>

			<Table
				data={ecos
					.map(
						(eco, index) =>
							({
								...eco,
								popularityStr: kFormatter(eco.popularity),
								userCountStr: kFormatter(eco.userCount),
								rank: index + 1,
							} as Row)
					)
					.filter(({ title }) =>
						title.toLowerCase().includes(search.toLowerCase())
					)
					.slice(0, limit)}
			>
				<Table.Column<Row> prop="rank" label="Rank" />
				<Table.Column<Row> prop="title" label="Ecosystem" />
				<Table.Column<Row> prop="popularityStr">
					Popularity{' '}
					<Tooltip text={'How is popularity calculated?'} type="dark">
						<Link href="faq#how-are-ecosystems-ranked">
							<Avatar text="?" />
						</Link>
					</Tooltip>
				</Table.Column>
				<Table.Column<Row>
					label="Developers"
					prop="slug"
					render={renderCtaColumn}
				/>
			</Table>

			<Spacer />
			<div className="flex justify-center">
				<Button
					disabled={limit >= ecos.length}
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
					disabled={limit >= ecos.length}
					icon={<ChevronsDown />}
					onClick={() => setLimit(ecos.length)}
					scale={1 / 2}
					ghost
					type="secondary"
				>
					Load all {ecos.length}
				</Button>
			</div>
		</>
	);
}
