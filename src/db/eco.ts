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
	top_level_eco: string;
	userCount: number;
}

const popularityQuery = ({
	limitClause = '',
	orderByClause = 'ORDER BY popularity DESC',
}: {
	limitClause?: string;
	orderByClause?: string;
}) => `
WITH popularity AS (
	SELECT
		COUNT(DISTINCT(r.name)) AS repoCount,
		COUNT(DISTINCT(c.github_login_encrypted)) AS userCount,
		SUM(r.forks + r.stars + r.watchers) AS popularity,
		CASE instr(e.path, '/') WHEN 0 THEN
			e.path
		ELSE
			substr(e.path, 0, instr(e.path, '/'))
		END AS top_level_eco
	FROM ecosystems e
	INNER JOIN ecosystem_repos er ON er.ecosystem_slug = e.slug
	INNER JOIN repos r ON r.name = er.repo_name
	INNER JOIN commits c ON c.repo_name = r.name
	GROUP BY top_level_eco
)
SELECT
	e.slug,
	e.title,
	e.path,
	p.repoCount,
	p.userCount,
	p.popularity
FROM ecosystems e
INNER JOIN popularity p on p.top_level_eco = e.slug
${orderByClause}
${limitClause}
`;

export function all(): Ecosystem[] {
	return db.prepare(popularityQuery({})).all() as Ecosystem[];
}

const popularityForSlugQuery = `
WITH popularity AS (
	SELECT
		COUNT(DISTINCT(r.name)) AS repoCount,
		COUNT(DISTINCT(c.github_login_encrypted)) AS userCount,
		SUM(r.forks + r.stars + r.watchers) AS popularity
	FROM ecosystems e
	INNER JOIN ecosystem_repos er ON er.ecosystem_slug = e.slug
	INNER JOIN repos r ON r.name = er.repo_name
	INNER JOIN commits c ON c.repo_name = r.name
	WHERE e.slug = ? OR e.path LIKE ? OR e.path LIKE ?
)
SELECT
	e.slug,
	e.title,
	e.path,
	p.repoCount,
	p.userCount,
	p.popularity
FROM ecosystems e, popularity p
WHERE e.slug = ?
`;

export function get(slug: string): Ecosystem {
	return db
		.prepare(popularityForSlugQuery)
		.get(slug, `${slug}/%`, `%/${slug}/%`, slug) as Ecosystem;
}
