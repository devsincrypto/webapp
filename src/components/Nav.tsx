import { Link as GeistLink, Spacer, Tabs, Text } from '@geist-ui/react';
import { useRouter } from 'next/dist/client/router';
import Link from 'next/link';
import React from 'react';

export function Nav(): React.ReactElement {
	const router = useRouter();

	return (
		<>
			<Spacer />
			<nav>
				<Link href="/">
					<GeistLink>
						<Text h3>Devs in Crypto</Text>
					</GeistLink>
				</Link>
			</nav>

			<Tabs
				initialValue="/"
				onChange={(v) => router.push(v)}
				value={router.asPath}
			>
				<Tabs.Item label="Home" value="/" />
				<Tabs.Item label="Analysis" value="/analysis"></Tabs.Item>
				<Tabs.Item label="F.A.Q." value="/faq"></Tabs.Item>
			</Tabs>
		</>
	);
}
