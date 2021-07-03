import '../styles/global.css';

import type { AppProps } from 'next/app';
import React from 'react';

import { Layout } from '../components';

export default function MyApp({
	Component,
	pageProps,
}: AppProps): React.ReactElement {
	return (
		<Layout>
			<>
				<Component {...pageProps} />
			</>
		</Layout>
	);
}
