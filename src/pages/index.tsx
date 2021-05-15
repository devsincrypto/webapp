import { GetStaticProps } from 'next';
import Link from 'next/link';
import React from 'react';

import { EcosystemList, Footer, Head, Nav } from '../components';
import type { Ecosystem } from '../db';
import all from '../db/json/ecosystems/all.json';

// eslint-disable-next-line @typescript-eslint/require-await
export const getStaticProps: GetStaticProps = async () => {
	const ecos = all;

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
			<Nav />
			<div className="hero bg-gray">
				<div className="hero-body">
					<h1>
						All the developers working
						<br />
						in <strong>blockchain</strong> and{' '}
						<strong>crypto</strong>.
						<br />
						Ranked.
					</h1>
					<p>This is a hero example</p>
				</div>
			</div>

			<div className="thin-container">
				<section className="section">
					<EcosystemList ecos={ecos} />
				</section>
			</div>
		</>
	);
}
