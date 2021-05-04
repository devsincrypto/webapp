import { db } from './db';

export interface Ecosystem {
	popularity: number;
	reposCount: number;
	slug: string;
	title: string;
}

export function all(): string[] {
	return db
		.prepare(`SELECT slug FROM ecosystems;`)
		.all()
		.map(({ slug }) => slug as string);
}

export function top20(): Ecosystem[] {
	return db
		.prepare(
			`
SELECT
    ecosystems.slug,
    ecosystems.title,
    COUNT(repos.id) as reposCount,
    SUM(repos.forks + repos.stars + repos.watchers) as popularity
FROM ecosystems
INNER JOIN ecosystem_repos ON ecosystems.id = ecosystem_repos.ecosystem_id
INNER JOIN repos ON repos.id = ecosystem_repos.repo_id
GROUP BY ecosystems.slug
ORDER BY popularity DESC
LIMIT 20;`
		)
		.all() as Ecosystem[];
}

export function bySlug(slug: string): Ecosystem {
	return db
		.prepare(`SELECT * FROM ecosystems WHERE slug = ?;`)
		.get(slug) as Ecosystem;
}
