import { GetServerSideProps } from 'next';
import React from 'react';

import { Footer, Head, Nav, UserList } from '../../components';
import { ecoQ, Ecosystem, User, userQ } from '../../db';
import { kFormatter } from '../../util';

// TODO We should replace this with static generation, but it was too slow on
// Vercel (>45min).
// eslint-disable-next-line @typescript-eslint/require-await
export const getServerSideProps: GetServerSideProps = async ({ params }) => {
	if (!params?.eco) {
		throw new Error('`params.eco` should not be empty');
	}

	const ecoSlug = params.eco as string;
	const eco = ecoQ.get(ecoSlug);
	const users = userQ.top20UsersByEco(ecoSlug);

	return {
		props: { eco, users },
	};
};

interface EcosystemProps {
	eco: Ecosystem;
	users: User[];
}

function linkToGithub(repoName: string): string {
	return `https://github.com/${repoName}`;
}

export default function Eco({
	eco,
	users,
}: EcosystemProps): React.ReactElement {
	return (
		<>
			<Head />
			<Nav activeEcoSlug={eco.slug} ecoPath={eco.path} />
			<div className="hero bg-gray">
				<div className="hero-body">
					<h1>{eco.title}</h1>
					<p>
						We found {kFormatter(eco.userCount)} users scanning
						through {kFormatter(eco.repoCount)} repositories in the{' '}
						{eco.title} ecosystem.
					</p>
				</div>
			</div>

			<div className="thin-container p-2">
				<UserList users={users} />
			</div>
			<Footer />
		</>
	);
}
