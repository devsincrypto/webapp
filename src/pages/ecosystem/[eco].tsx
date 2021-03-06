import { Spacer, Text } from '@geist-ui/react';
import { GetStaticPaths, GetStaticProps } from 'next';
import React from 'react';

import { UserList } from '../../components';
import { RepoList } from '../../components/RepoList';
import { Ecosystem, Repo, User } from '../../db';
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
	const repos = ((await import(
		`../../db/json/repos/byEco/${ecoSlug}.json`
	)) as { default: Repo[] }).default;
	const users = ((await import(
		`../../db/json/users/byEco/${ecoSlug}.json`
	)) as { default: User[] }).default;

	return {
		props: { eco, repos, users },
	};
};

interface EcosystemProps {
	eco: Ecosystem;
	repos: Repo[];
	users: User[];
}

export default function Eco({
	eco,
	repos,
	users,
}: EcosystemProps): React.ReactElement {
	return (
		<>
			<div>
				<Text h1>{eco.title}</Text>
				<Text p>
					We found {kFormatter(eco.userCount)} developers scanning
					through {kFormatter(eco.repoCount)} repositories in the{' '}
					{eco.title} ecosystem.
				</Text>
			</div>

			<UserList eco={eco} users={users} />
			<Spacer h={5} />
			<RepoList eco={eco} repos={repos} />
		</>
	);
}
