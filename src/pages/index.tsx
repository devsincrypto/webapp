import { GetStaticProps } from 'next';
import React from 'react';

import { Head, Nav } from '../components';
import { Ecosystem, getTop20Ecos } from '../db';

export const getStaticProps: GetStaticProps = async () => {
	const ecos = getTop20Ecos();

	return {
		props: {
			ecos,
		},
	};
};

interface IndexProps {
	ecos: Ecosystem[];
}

export default function Index({ ecos }: IndexProps) {
	return (
		<>
			<Head />
			<Nav />
			<div className="hero bg-gray">
				<div className="hero-body">
					<h1>All the crypto developers, ranked.</h1>
					<p>This is a hero example</p>
				</div>
			</div>

			<div className="columns">
				{ecos.map((eco) => (
					<div className="column col-3" key={eco.slug}>
						<div className="card">
							<div className="card-header">
								<div className="card-title h5">{eco.title}</div>
								<div className="card-subtitle text-gray">
									{eco.popularity}
								</div>
							</div>
							<div className="card-body">
								See {eco.reposCount} repos
							</div>
							<div className="card-footer">
								<button className="btn btn-primary">
									Discover devs.
								</button>
							</div>
						</div>
					</div>
				))}
			</div>
		</>
	);
}
