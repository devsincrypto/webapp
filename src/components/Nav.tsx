import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

import { useUser } from '../util/useUser';

interface NavProps {
	activeEcoSlug?: string;
	ecoPath?: string;
}

export function Nav({ activeEcoSlug, ecoPath }: NavProps): React.ReactElement {
	const { user, signOut } = useUser();
	const router = useRouter();

	return (
		<header className="navbar p-2">
			<section className="navbar-section">
				<span className="navbar-brand mr-2">
					<Link href="/">Devs in Crypto</Link>
				</span>
			</section>
			<section className="navbar-section">
				{ecoPath && (
					<ul className="breadcrumb">
						<li className="breadcrumb-item">
							<Link href="/ecosystem">ecosystems</Link>
						</li>
						{ecoPath.split('/').map((ecoSlug) => (
							<li className="breadcrumb-item" key={ecoSlug}>
								{activeEcoSlug === ecoSlug ? (
									ecoSlug
								) : (
									<Link href={`/ecosystem/${ecoSlug}`}>
										{ecoSlug}
									</Link>
								)}
							</li>
						))}
					</ul>
				)}
			</section>
			<section className="navbar-section">
				<Link href="/pricing">
					<button className="btn btn-link">Pricing</button>
				</Link>
				{user ? (
					<div className="dropdown dropdown-right">
						<button className="btn btn-link dropdown-toggle">
							My Account
						</button>

						<ul className="menu">
							<li className="menu-item">
								<div className="chip">
									<figure
										className="avatar avatar-sm"
										data-initial={user.email?.slice(0, 2)}
									></figure>
									{user.email}
								</div>
							</li>
							<li className="menu-item">
								<Link href="/account">Dashboard</Link>
							</li>
							<li className="menu-item">
								<a
									href="#"
									onClick={() =>
										signOut()
											.then(() => router.push('/'))
											.catch(console.error)
									}
								>
									Sign out
								</a>
							</li>
						</ul>
					</div>
				) : (
					<>
						<Link href="/signin">
							<button className="btn btn-sm">Sign In</button>
						</Link>
						<Link href="/signup">
							<button className="btn btn-sm">Sign Up</button>
						</Link>
					</>
				)}
			</section>
		</header>
	);
}
