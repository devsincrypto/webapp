import { db } from './db';

export interface CommitCount {
	githubLogin: string;
	score: number;
}

export function top20UsersByEcosystem(ecoSlug: string): CommitCount[] {
	return db
		.prepare(
			`
SELECT
	commits.github_login as githubLogin,
	SUM(commits.commit_count * (repos.stars + repos.forks + repos.watchers)) as score
FROM commits
INNER JOIN repos ON repos.name = commits.repo_name
INNER JOIN ecosystem_repos ON ecosystem_repos.repo_name = repos.name
WHERE ecosystem_repos.ecosystem_slug = ?
AND commits.github_login NOT LIKE '%[bot]%'
GROUP BY githubLogin
ORDER BY score DESC
LIMIT 20;`
		)
		.all(ecoSlug) as CommitCount[];
}
