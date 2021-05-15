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
						its &quot;/&quot;-delimited path. For example, [Regen
						Network](https://regen.network), which is a subecosystem
						of the wider [Cosmos](https://cosmos.network) ecosystem,
						is identified by &quot;cosmos/regen-network&quot;.
					</p>
				</div>
			</div>
		</>
	);
}
