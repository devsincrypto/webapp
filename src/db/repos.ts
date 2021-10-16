import { db } from './db';

export interface Repo {
	forks: number;
	name: string;
	stars: number;
	watchers: number;
}

export function byEcosystem(ecoSlug: string): Repo[] {
	return db
		.prepare(
			`
SELECT *
FROM repos
INNER JOIN ecosystem_repos on ecosystem_repos.repo_name = repos.name
INNER JOIN ecosystems on ecosystem_repos.ecosystem_slug = ecosystems.slug
WHERE ecosystems.slug = ?
ORDER BY repos.forks + repos.stars + repos.watchers DESC;`
		)
		.all(ecoSlug) as Repo[];
}
