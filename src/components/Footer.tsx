import React from 'react';

export function Footer(): React.ReactElement {
	return (
		<footer className="bg-gray">
			<div className="thin-container section text-center">
				<p>© Devs in Crypto 2021</p>

				<a
					href="https://vercel.com?utm_source=devsincrypto&utm_campaign=oss"
					target="_blank"
					rel="noopener noreferrer"
				>
					<img src="/powered-by-vercel.svg" />
				</a>
			</div>
		</footer>
	);
}
