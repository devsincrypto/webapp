import '../styles/global.css';

import { CssBaseline, GeistProvider } from '@geist-ui/react';
import type { AppProps } from 'next/app';
import React from 'react';

import { Layout } from '../components';

export default function MyApp({
	Component,
	pageProps,
}: AppProps): React.ReactElement {
	return (
		<GeistProvider>
			<CssBaseline />
			<Layout>
				<>
					<Component {...pageProps} />
				</>
			</Layout>
		</GeistProvider>
	);
}
