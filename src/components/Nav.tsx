import { Tabs, Text } from '@geist-ui/react';
import { useRouter } from 'next/dist/client/router';
import Link from 'next/link';
import React from 'react';

export function Nav(): React.ReactElement {
	const router = useRouter();

	return (
		<>
			<nav>
				<Link href="/">
					<Text h3>Devs in Crypto</Text>
				</Link>
			</nav>

			<Tabs initialValue="/" onChange={(v) => router.push(v)}>
				<Tabs.Item label="Home" value="/"></Tabs.Item>
				<Tabs.Item label="Analysis" value="/analysis"></Tabs.Item>
				<Tabs.Item label="F.A.Q." value="/faq"></Tabs.Item>
			</Tabs>
		</>
	);
}
