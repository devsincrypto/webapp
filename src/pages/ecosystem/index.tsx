import { GetStaticProps } from 'next';
import React from 'react';

import { EcosystemList, Footer, Head, Nav } from '../../components';
import { Ecosystem } from '../../db';
import all from '../../db/json/ecosystems/all.json';

// eslint-disable-next-line @typescript-eslint/require-await
export const getStaticProps: GetStaticProps = async () => {
	const ecos = all;

	return {
		props: {
			ecos,
		},
	};
};

interface EcoIndexProps {
	ecos: Ecosystem[];
}

export default function EcoIndex({ ecos }: EcoIndexProps): React.ReactElement {
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

			<div className="thin-container p-2">
				<EcosystemList ecos={ecos} />
			</div>
			<Footer />
		</>
	);
}
