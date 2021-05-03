import { db } from './db';

export interface Ecosystem {
	popularity: number;
	reposCount: number;
	slug: string;
	title: string;
}

export function getTop20Ecos(): Ecosystem[] {
	const rows = db
		.prepare(
			`
SELECT
    ecosystems.slug,
    ecosystems.title,
    COUNT(repos.id) as reposCount,
    SUM(repos.forks + repos.stars + repos.watchers) as popularity
FROM ecosystems
JOIN ecosystem_repos ON ecosystems.id = ecosystem_repos.ecosystem_id
JOIN repos ON repos.id = ecosystem_repos.repo_id
GROUP BY ecosystems.slug
ORDER BY popularity DESC
LIMIT 20;`
		)
		.all() as Ecosystem[];

	return rows;
}
