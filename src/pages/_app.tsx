import type { AppProps } from 'next/app';
import React from 'react';

export default function MyApp({
	Component,
	pageProps,
}: AppProps): React.ReactElement {
	return (
		<div className="container">
			<Component {...pageProps} />
		</div>
	);
}
