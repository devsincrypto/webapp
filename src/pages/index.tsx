import { Text } from '@geist-ui/react';
import { GetStaticProps } from 'next';
import React from 'react';

import { EcosystemList } from '../components';
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
			<div>
				<Text h1>
					Find all the developers working
					<br />
					in <strong>blockchain</strong> and <strong>crypto</strong>.
					<br />
					Ranked.
				</Text>
				<br />
				<Text p>
					Devs in Crypto sorts developers by blockchain ecosystems,
					<br />
					and ranks them within each ecosystem by their Github
					activity.
				</Text>
			</div>
			<EcosystemList ecos={ecos} />
		</>
	);
}
