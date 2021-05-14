import { GetStaticPaths, GetStaticProps } from 'next';
import React from 'react';

import { Head, Nav, UserList } from '../../components';
import { Ecosystem, User } from '../../db';
import ecoSlugs from '../../db/json/ecosystems/slugs.json';
import { kFormatter } from '../../util/format';

// eslint-disable-next-line @typescript-eslint/require-await
export const getStaticPaths: GetStaticPaths = async () => {
	return {
		paths: ecoSlugs.map((eco) => ({ params: { eco } })),
		fallback: false,
	};
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
	if (!params?.eco) {
		throw new Error('`params.eco` should not be empty');
	}

	const ecoSlug = params.eco as string;
	const eco = ((await import(
		`../../db/json/ecosystems/bySlug/${ecoSlug}.json`
	)) as { default: Ecosystem }).default;
	const users = ((await import(
		`../../db/json/users/byEco/${ecoSlug}.json`
	)) as { default: User[] }).default;

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
				<UserList eco={eco} users={users} />
			</div>
		</>
	);
}
