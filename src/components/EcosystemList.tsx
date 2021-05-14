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

	return (
		<>
			<h2>Top {limit} Ecosystems</h2>
			<table className="table">
				<thead>
					<tr>
						<th>Rank</th>
						<th>Ecosystem</th>
						<th>Popularity</th>
						<th>Users</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					{ecos.slice(0, limit).map((eco, i) => (
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
