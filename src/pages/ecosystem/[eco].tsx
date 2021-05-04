import { GetStaticPaths, GetStaticProps } from 'next';
import React from 'react';

import { Head, Nav } from '../../components';
import { ecoQ, Ecosystem, Repo, repoQ } from '../../db';

export const getStaticPaths: GetStaticPaths = async () => {
	const ecos = ecoQ.all();

	return {
		fallback: false,
		paths: ecos.map((eco) => ({ params: { eco } })),
	};
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
	if (!params?.eco) {
		throw new Error('`params.eco` should not be empty');
	}

	const ecoSlug = params.eco as string;
	const eco = ecoQ.bySlug(ecoSlug);
	const repos = repoQ.byEcosystem(ecoSlug);
	return { props: { eco, repos } };
};

interface EcosystemProps {
	eco: Ecosystem;
	repos: Repo[];
}

function linkToGithub(repoName: string): string {
	return `https://github.com/${repoName}`;
}

export default function Eco({
	eco,
	repos,
}: EcosystemProps): React.ReactElement {
	return (
		<>
			<Head />
			<Nav />
			<div className="hero bg-gray">
				<div className="hero-body">
					<h1>{eco.title}</h1>
					<p>This is a hero example</p>
				</div>
			</div>
			<div className="columns">
				<div className="column col-6">
					<table className="table table-striped table-hover">
						<thead>
							<tr>
								<th>name</th>
								<th>forks</th>
								<th>stars</th>
								<th>watchers</th>
							</tr>
						</thead>
						<tbody>
							{repos.map((repo) => (
								<tr key={repo.name}>
									<td>
										<a href={linkToGithub(repo.name)}>
											{repo.name}
										</a>
									</td>
									<td>{repo.forks}</td>
									<td>{repo.stars}</td>
									<td>{repo.watchers}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</>
	);
}
