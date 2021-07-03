import Link from 'next/link';
import React from 'react';

export function Nav(): React.ReactElement {
	return (
		<header className="navbar">
			<section className="navbar-section">
				<Link href="/">
					<a href="#" className="navbar-brand mr-2">
						Devs in Crypto
					</a>
				</Link>
				<Link href="/analysis">
					<button className="btn btn-link">Analysis</button>
				</Link>
				<Link href="/faq">
					<button className="btn btn-link">FAQ</button>
				</Link>
			</section>
		</header>
	);
}
