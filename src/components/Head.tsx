import NextHead from 'next/head';
import React from 'react';

export function Head(): React.ReactElement {
	return (
		<NextHead>
			<meta charSet="utf-8" />
		</NextHead>
	);
}
