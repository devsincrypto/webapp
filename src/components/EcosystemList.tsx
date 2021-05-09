import Link from 'next/link';
import React from 'react';

import { kFormatter } from '../common';
import { Ecosystem } from '../db';

interface EcosystemListProps {
	ecos: Ecosystem[];
}

export function EcosystemList({
	ecos,
}: EcosystemListProps): React.ReactElement {
	return (
		<>
			{ecos.map((eco, i) => (
				<div className="tile" key={eco.slug}>
					<div className="tile-icon">
						<div className="example-tile-icon">
							<i className="icon icon-file centered"></i>
						</div>
					</div>
					<div className="tile-content">
						<p className="tile-title d-flex">
							<h4>
								#{i + 1} {eco.title}
							</h4>
							<span className="chip">
								Popularity: {kFormatter(eco.popularity)}
							</span>
						</p>
						<p className="tile-subtitle">
							Found{' '}
							<span className="text-primary">
								{kFormatter(eco.userCount)} users
							</span>{' '}
							and {kFormatter(eco.repoCount)} repositories.
						</p>
					</div>
					<div className="tile-action">
						<Link href={`/ecosystem/${eco.slug}`}>
							<button className="btn btn-primary">
								See Ecosystem
							</button>
						</Link>
					</div>
				</div>
			))}
		</>
	);
}
