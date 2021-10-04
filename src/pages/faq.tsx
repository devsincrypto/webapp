import React from 'react';

import { Nav } from '../components';

export default function Faq(): React.ReactElement {
	return (
		<>
			<div className="thin-container">
				<div className="section">
					<h1>FAQ</h1>

					<h2>What is &quot;Devs in Crypto&quot;?</h2>
					<p>
						Devs in Crypto is a website that sorts all developers by
						blockchain ecosystem. Within each ecosystem, the
						developers are then ranked by their Github activity.
					</p>

					<h2>What is an ecosystem?</h2>
					<p>
						An ecosystem is a set of projects that use similar
						blockchain technologies. An ecosystem can also have
						subecosystems. Each ecosystem is uniquely identified by
						a &quot;/&quot;-delimited path. For example,{' '}
						<a
							href="https://regen.network"
							target="_blank"
							rel="noopener noreferrer"
						>
							Regen Network
						</a>
						, which is a subecosystem of the wider{' '}
						<a
							href="https://cosmos.network"
							target="_blank"
							rel="noopener noreferrer"
						>
							Cosmos
						</a>{' '}
						ecosystem, is identified by the path{' '}
						<code>cosmos/regen-network</code>.
					</p>

					<h2 id="how-are-ecosystems-ranked">
						How are ecosystems ranked?
					</h2>
					<p>
						Ecosystems are ranked by popularity, where an
						ecosystem&apos;s popularity is defined as the sum of all
						its associated Github repositories&apos; popularity.
					</p>
					<p>
						A repository&apos;s popularity is, in turn, given by the
						formula:
						<br />
						<code>
							repo.watchers_count + repo.stars_count + repo.forks
						</code>
						.
					</p>

					<h2 id="how-is-developers-score-calculated">
						How is a developer&apos;s score calculated?
					</h2>
					<p>
						The developer&apos;s score is defined by the formula:
						<br />
						<code>
							sum_over_repos( user.commit_count_in_repo *
							repo.popularity )
						</code>
					</p>
					<p>
						This means that developers with more commits and
						contributing to popular repos will have a higher score.
						If you have ideas how to improve the estimation of a
						user&apos;s score, please{' '}
						<a
							href="https://github.com/devsincrypto/webapp/issues/10"
							target="_blank"
							rel="noopener noreferrer"
						>
							head to Github
						</a>
						.
					</p>

					<h2>Where did you get the data?</h2>
					<p>
						All data shown on Crypto in Devs is publicly available.
					</p>
					<p>
						We use different sources to aggregate the data:{' '}
						<code>TODO</code>
					</p>
				</div>
			</div>
		</>
	);
}
