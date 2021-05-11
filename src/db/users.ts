import { db } from './db';

export interface User {
	githubLogin: string;
	id: number;
	score: number;
}

export function top20UsersByEco(ecoSlug: string): User[] {
	return db
		.prepare(
			`
SELECT
	c.rowid as id,
	c.github_login as githubLogin,
	SUM(c.commit_count * (r.stars + r.forks + r.watchers)) as score
FROM commits c
INNER JOIN repos r ON r.name = c.repo_name
INNER JOIN ecosystem_repos er ON er.repo_name = r.name
INNER JOIN ecosystems e ON e.slug = er.ecosystem_slug
WHERE (e.slug = ? OR e.path LIKE ? OR e.path LIKE ?)
AND c.github_login NOT LIKE '%[bot]%' AND c.github_login NOT LIKE '%-bot%'
GROUP BY githubLogin
ORDER BY score DESC;`
		)
		.all(ecoSlug, `${ecoSlug}/%`, `%/${ecoSlug}/%`) as User[];
}

export function githubLoginById(id: number): string {
	return (db
		.prepare(
			`SELECT github_login AS githubLogin FROM users WHERE rowid = ?;`
		)
		.get(id) as User).githubLogin;
}
