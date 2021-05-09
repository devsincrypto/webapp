import { GetStaticPaths, GetStaticProps } from 'next';
import React from 'react';

import { kFormatter } from '../../../common';
import { Head, Nav, UserList } from '../../../components';
import { CommitCount, commitQ, ecoQ, Ecosystem } from '../../../db';

// eslint-disable-next-line @typescript-eslint/require-await
export const getStaticPaths: GetStaticPaths = async () => {
	const ecos = ecoQ.allSlugs();

	return {
		fallback: false,
		paths: ecos.map((eco) => ({ params: { eco } })),
	};
};

// eslint-disable-next-line @typescript-eslint/require-await
export const getStaticProps: GetStaticProps = async ({ params }) => {
	if (!params?.eco) {
		throw new Error('`params.eco` should not be empty');
	}

	const ecoSlug = params.eco as string;
	const eco = ecoQ.get(ecoSlug);
	const users = commitQ.top20UsersByEcosystem(ecoSlug);

	return { props: { eco, users } };
};

interface EcosystemProps {
	eco: Ecosystem;
	users: CommitCount[];
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
			<Nav ecoPath={eco.path} />
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

			<div className="thin-container">
				<UserList users={users} />
			</div>
		</>
	);
}
