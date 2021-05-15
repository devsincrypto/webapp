import React from 'react';

import { Nav } from '../components';

export default function Faq(): React.ReactElement {
	return (
		<>
			<Nav />
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
						<br />
						<br />A repository&apos;s popularity is, in turn, given
						by the formula:
						<br />
						<code>
							repo.watchers_count + repo.stars_count + repo.forks
						</code>
						.
					</p>

					<h2 id="how-is-developers-score-calculated">
						How is a developer&apos;s score calculated?
					</h2>
					<p>TODO</p>

					<h2>Where did you get the data?</h2>
					<p>TODO</p>
				</div>
			</div>
		</>
	);
}
