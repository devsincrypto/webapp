import Link from 'next/link';
import React from 'react';

export function Nav(): React.ReactElement {
	return (
		<header className="navbar p-2">
			<section className="navbar-section">
				<span className="navbar-brand mr-2">
					<Link href="/">CryptoDevs</Link>
				</span>
			</section>
		</header>
	);
}
