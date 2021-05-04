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
INNER JOIN ecosystem_repos on ecosystem_repos.repo_id = repos.id
INNER JOIN ecosystems on ecosystem_repos.ecosystem_id = ecosystems.id
WHERE ecosystems.slug = ?
ORDER BY repos.forks + repos.stars + repos.watchers DESC;`
		)
		.all(ecoSlug) as Repo[];
}
