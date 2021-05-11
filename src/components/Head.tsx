import NextHead from 'next/head';
import React from 'react';

export function Head() {
	return (
		<NextHead>
			<meta charSet="utf-8" />
			<link
				rel="stylesheet"
				href="https://unpkg.com/spectre.css/dist/spectre.min.css"
			></link>
		</NextHead>
	);
}
