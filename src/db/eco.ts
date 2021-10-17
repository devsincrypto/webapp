import { db } from './db';

export function allSlugs(): string[] {
	return db
		.prepare(`SELECT slug FROM ecosystems;`)
		.all()
		.map(({ slug }) => slug as string);
}

export interface Ecosystem {
	parentSlug?: string;
	path: string;
	slug: string;
	title: string;
	popularity: number;
	repoCount: number;
	userCount: number;
}

// Query all ecosystems, as well as their children's recursively aggregated
// score.
const queryAll = () => `
WITH eco_data AS
(${queryEcosystem({ groupByClause: 'GROUP BY e.slug' })}),
tree AS
(
	SELECT
		e.slug			AS base_slug,
		e.slug			AS current_slug,
		ed.popularity,
		ed.repoCount,
		ed.userCount
	FROM
		ecosystems e
	INNER JOIN
		eco_data ed
			ON e.slug = ed.slug

	UNION ALL

	SELECT
		t.base_slug,
		e.slug,
		ed.popularity,
		ed.repoCount,
		ed.userCount
	FROM
		tree t
	INNER JOIN
		ecosystems e
			ON e.parent_slug = t.current_slug
	INNER JOIN
		eco_data ed
			ON e.slug = ed.slug
)
SELECT
	t.base_slug			AS slug,
	ed.path,
	ed.title,
	SUM(t.repoCount)	AS repoCount,
	SUM(t.userCount)	AS userCount,
	SUM(t.popularity)	AS popularity
FROM
	tree t
INNER JOIN
	eco_data ed ON t.base_slug = ed.slug
GROUP BY
	base_slug
ORDER BY
	popularity DESC
`;

export function all(): Ecosystem[] {
	return db.prepare(queryAll()).all() as Ecosystem[];
}

// Query one particular ecosystem and its user count, repo count and
// popularity.
const queryEcosystem = ({ whereClause = '', groupByClause = '' } = {}) => `
SELECT
	e.slug,
	e.title,
	e.parent_slug,
	e.path,
	COUNT(DISTINCT(r.name)) 					AS repoCount,
	COUNT(DISTINCT(c.github_login_encrypted)) 	AS userCount,
	SUM(r.forks + r.stars + r.watchers) 		AS popularity
FROM
	ecosystems e
INNER JOIN
	ecosystem_repos er ON er.ecosystem_slug = e.slug
INNER JOIN
	repos r ON r.name = er.repo_name
INNER JOIN
	commits c ON c.repo_name = r.name
${whereClause}
${groupByClause}
`;

const queryEcosystemBySlug = `
WITH popularity AS (
	${queryEcosystem({
		whereClause: 'WHERE e.slug = ? OR e.path LIKE ? OR e.path LIKE ?',
	})}
)
SELECT
	e.slug,
	e.title,
	e.parent_slug,
	e.path,
	p.repoCount,
	p.userCount,
	p.popularity
FROM
	ecosystems e, popularity p
WHERE
	e.slug = ?
`;

export function get(slug: string): Ecosystem {
	return db
		.prepare(queryEcosystemBySlug)
		.get(slug, `${slug}/%`, `%/${slug}/%`, slug) as Ecosystem;
}
