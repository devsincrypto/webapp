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
FROM repos r
INNER JOIN ecosystem_repos er on er.repo_name = r.name
INNER JOIN ecosystems e on er.ecosystem_slug = e.slug
WHERE e.slug = ? OR e.path LIKE ? OR e.path LIKE ?
ORDER BY r.forks + r.stars + r.watchers DESC;`
		)
		.all(ecoSlug, `${ecoSlug}/%`, `%/${ecoSlug}/%`) as Repo[];
}
