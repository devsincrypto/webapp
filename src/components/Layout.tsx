import React from 'react';

import { Footer } from './Footer';
import { Head } from './Head';

export const Layout: React.FunctionComponent = ({ children }) => {
	return (
		<>
			<Head />
			<div className="p-2">
				{children}
				<Footer />
			</div>
		</>
	);
};
