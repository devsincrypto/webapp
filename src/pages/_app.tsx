import '../styles/global.css';

import type { AppProps } from 'next/app';
import React from 'react';

import { UserContextProvider } from '../util/useUser';

export default function MyApp({
	Component,
	pageProps,
}: AppProps): React.ReactElement {
	return (
		<UserContextProvider>
			<Component {...pageProps} />
		</UserContextProvider>
	);
}
