import Link from 'next/link';
import React, { useState } from 'react';

import { Ecosystem } from '../db';
import { kFormatter } from '../util/format';

interface EcosystemListProps {
	ecos: Ecosystem[];
}

export function EcosystemList({
	ecos,
}: EcosystemListProps): React.ReactElement {
	const [limit, setLimit] = useState(5);
	const [search, setSearch] = useState('');

	return (
		<>
			<h2>
				{search
					? `Ecosystems matching "${search}"`
					: `Top ${limit} Ecosystems`}
			</h2>
			<div className="has-icon-left float-right">
				<input
					className="form-input"
					onChange={(e) => setSearch(e.currentTarget.value)}
					placeholder="Search ecosystem"
					value={search}
				/>
				<i className="form-icon icon icon-search"></i>
			</div>

			<table className="table">
				<thead>
					<tr>
						<th>Rank</th>
						<th>Ecosystem</th>
						<th>
							Popularity{' '}
							<Link href="faq#how-are-ecosystems-ranked">
								<figure
									className="avatar avatar-sm c-hand tooltip tooltip-right"
									data-initial="?"
									data-tooltip="How is popularity calculated?"
								></figure>
							</Link>
						</th>
						<th>Developers</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					{ecos
						.filter(({ title }) =>
							title.toLowerCase().includes(search.toLowerCase())
						)
						.slice(0, limit)
						.map((eco, i) => (
							<tr key={eco.slug}>
								<td>#{i + 1}</td>
								<td>{eco.title}</td>
								<td>
									<code>{kFormatter(eco.popularity)}</code>
								</td>
								<td>
									<code>{kFormatter(eco.userCount)}</code>
								</td>
								<td>
									<Link href={`/ecosystem/${eco.slug}`}>
										<button className="btn btn-primary">
											See Ecosystem
										</button>
									</Link>
								</td>
							</tr>
						))}
				</tbody>
			</table>
			<button
				className="btn btn-sm"
				disabled={limit >= ecos.length}
				onClick={() => setLimit(limit + 5)}
			>
				Load more
			</button>
			<button
				className="btn btn-sm"
				disabled={limit >= ecos.length}
				onClick={() => setLimit(ecos.length)}
			>
				Load all
			</button>
		</>
	);
}
