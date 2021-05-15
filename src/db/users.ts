import { db } from './db';

export interface User {
	githubLoginEncrypted: string;
	githubLoginHashed: string;
	githubLoginMasked: string;
	id: number;
	score: number;
}

export function usersByEco(ecoSlug: string): User[] {
	return db
		.prepare(
			`
SELECT
	c.rowid as id,
	github_login_masked as githubLoginMasked,
	u.github_login_encrypted as githubLoginEncrypted,
	c.github_login_hashed as githubLoginHashed,
	SUM(c.commit_count * (r.stars + r.forks + r.watchers)) as score
FROM commits c
INNER JOIN repos r ON r.name = c.repo_name
INNER JOIN ecosystem_repos er ON er.repo_name = r.name
INNER JOIN ecosystems e ON e.slug = er.ecosystem_slug
INNER JOIN users u ON u.github_login_hashed = c.github_login_hashed
WHERE (e.slug = ? OR e.path LIKE ? OR e.path LIKE ?)
GROUP BY githubLoginEncrypted
ORDER BY score DESC;`
		)
		.all(ecoSlug, `${ecoSlug}/%`, `%/${ecoSlug}/%`) as User[];
}
