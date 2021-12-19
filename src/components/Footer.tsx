import React from 'react';

import lastUpdated from '../db/json/lastUpdated.json';

export function Footer(): React.ReactElement {
	const date = new Date(lastUpdated);
	return (
		<footer className="text-center">
			<p>© Devs in Crypto 2021.</p>

			<p>
				Made by a crypto dev based in Paris 🇫🇷. Last update:{' '}
				{date.toISOString().split('T')[0]}.
				<br />
				<a href="mailto:amaury@devsincrypto.com">Support Email</a>
				{' - '}
				<a
					href="https://github.com/devsincrypto/webapp"
					target="_blank"
					rel="noopener noreferrer"
				>
					Github
				</a>
				{' - '}
				<a
					href="https://github.com/sponsors/amaurym"
					target="_blank"
					rel="noopener noreferrer"
				>
					Donate to help development
				</a>
			</p>
			<a
				href="https://vercel.com?utm_source=devsincrypto&utm_campaign=oss"
				target="_blank"
				rel="noopener noreferrer"
			>
				<img src="/powered-by-vercel.svg" />
			</a>
		</footer>
	);
}
