import Link from 'next/link';
import React from 'react';

import { Ecosystem } from '../db';
import { kFormatter } from '../util';

interface EcosystemListProps {
	ecos: Ecosystem[];
}

export function EcosystemList({
	ecos,
}: EcosystemListProps): React.ReactElement {
	return (
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
				{ecos.map((eco, i) => (
					<tr key={eco.slug}>
						<td>#{i + 1}</td>
						<td>{eco.title}</td>
						<td>{kFormatter(eco.popularity)}</td>
						<td>{kFormatter(eco.userCount)}</td>
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
	);
}
