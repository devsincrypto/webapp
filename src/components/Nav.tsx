import Link from 'next/link';
import React from 'react';

interface NavProps {
	ecoPath?: string;
}

export function Nav({ ecoPath }: NavProps): React.ReactElement {
	return (
		<header className="navbar p-2">
			<section className="navbar-section">
				<span className="navbar-brand mr-2">
					<Link href="/">Devs in Crypto</Link>
				</span>
				{ecoPath && (
					<ul className="breadcrumb">
						{ecoPath.split('/').map((ecoSlug) => (
							<li className="breadcrumb-item" key={ecoSlug}>
								<Link href={`/ecosystem/${ecoSlug}`}>
									{ecoSlug}
								</Link>
							</li>
						))}
					</ul>
				)}
			</section>
			<section className="navbar-section">
				<Link href="/signin">
					<button>Sign In</button>
				</Link>
				<Link href="/signup">
					<button>Sign Up</button>
				</Link>
			</section>
		</header>
	);
}
