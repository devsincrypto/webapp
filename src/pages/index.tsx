import { GetStaticProps } from 'next';
import Link from 'next/link';
import React from 'react';

import { Footer, Head, Nav } from '../components';
import { EcosystemList } from '../components/EcosystemList';
import { ecoQ, Ecosystem } from '../db';

// eslint-disable-next-line @typescript-eslint/require-await
export const getStaticProps: GetStaticProps = async () => {
	const ecos = ecoQ.top5();

	return {
		props: {
			ecos,
		},
	};
};

interface IndexProps {
	ecos: Ecosystem[];
}

export default function Index({ ecos }: IndexProps): React.ReactElement {
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
				<h2>Top 5 Ecosystems</h2>
				<EcosystemList ecos={ecos} />
				<Link href="/ecosystem">See all Ecosystems</Link>
			</div>
			<Footer />
		</>
	);
}
